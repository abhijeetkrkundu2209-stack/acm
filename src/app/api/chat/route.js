import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are ACM HIT's helpful tech assistant.
Answer technical questions clearly and concisely.
If the user asks about ACM HIT, membership, tests, or contact details, answer using the site context when possible.
If you are unsure, say so and suggest a practical next step.
Keep the tone professional, helpful, and brief.`;

function normalizeMessages(messages) {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .filter((message) => message && typeof message.text === "string")
    .slice(-12)
    .map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: String(message.text) }],
    }));
}

function buildModelCandidates() {
  const preferredModel = process.env.GEMINI_MODEL?.trim();
  return [
    preferredModel,
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-pro",
  ].filter((model, index, list) => model && list.indexOf(model) === index);
}

function extractLatestUserText(conversation) {
  const latestUserMessage = [...conversation].reverse().find((message) => message.role === "user");
  return String(latestUserMessage?.parts?.[0]?.text || "").trim();
}

function buildFallbackReply(userMessage) {
  const text = userMessage.toLowerCase();

  if (/\b(git|github|branch|merge|rebase|commit|pull request)\b/.test(text)) {
    return "Git tip: use `git status` to check changes, `git add .` to stage, `git commit -m \"message\"` to save, and `git push` to upload. If a merge conflict happens, resolve the conflicted files, stage them again, and commit the merge.";
  }

  if (/\b(react|next\.js|nextjs|frontend|component|hook|state)\b/.test(text)) {
    return "For React/Next.js, keep components small, lift shared state up when multiple children need it, and use server components for data-heavy pages when possible. If you want, I can also show a code example for your exact case.";
  }

  if (/\b(javascript|js|typescript|ts|array|object|promise|async|await)\b/.test(text)) {
    return "JavaScript tip: use `async/await` for readable async code, `Array.map()` for transformations, and `try/catch` for error handling. If you are debugging a specific snippet, paste it and I’ll walk through it step by step.";
  }

  if (/\b(python|django|flask|numpy|pandas)\b/.test(text)) {
    return "Python tip: start with clear functions, add type hints where useful, and use virtual environments for each project. For data work, `pandas` handles tables well and `numpy` is best for numerical arrays.";
  }

  if (/\b(java|spring|spring boot|oop|class|interface)\b/.test(text)) {
    return "Java tip: use classes and interfaces to model behavior cleanly, keep services small, and follow single-responsibility design. If you are working on Spring Boot, controller-service-repository layering keeps code easier to maintain.";
  }

  if (/\b(css|tailwind|responsive|layout|flex|grid|ui|design)\b/.test(text)) {
    return "CSS tip: use Flexbox for one-dimensional alignment, Grid for page layouts, and responsive breakpoints for mobile-first design. In Tailwind, combine utility classes instead of writing custom CSS unless the pattern repeats often.";
  }

  if (/\b(database|mongodb|sql|postgres|mysql|schema|mongoose)\b/.test(text)) {
    return "Database tip: store only what you need, index frequently queried fields, and validate inputs before saving. With MongoDB/Mongoose, define schemas carefully and avoid deeply nested documents unless the data is naturally hierarchical.";
  }

  if (/\b(placement|interview|resume|career|internship)\b/.test(text)) {
    return "Placement tip: build 2 to 4 strong projects, keep your resume concise, and practice DSA basics plus system design fundamentals. For interviews, explain your thinking clearly and mention trade-offs instead of only the final answer.";
  }

  if (/\b(acm|membership|test|contact|join)\b/.test(text)) {
    return "For ACM HIT: you can join from the 'Join ACM Now' button on the home page, the membership fee is Rs 100, tests are available from the test page, and contact submissions go directly to the admin inbox.";
  }

  return "I’m having trouble reaching Gemini right now, but I can still help. Ask about JavaScript, React, Next.js, Git, Python, CSS, databases, placements, or ACM HIT site features, and I’ll answer as best I can.";
}

function shouldUseFallback(error) {
  return (
    error?.status === 429 ||
    error?.status === 403 ||
    error?.status === 404 ||
    /quota exceeded|rate limit|not found|unsupported|does not exist|not supported|retry in/i.test(
      String(error?.message || "")
    )
  );
}

async function generateReplyForModel(modelName, conversation) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents: conversation,
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 600,
        },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const detail = String(data?.error?.message || "Failed to generate reply");
    const error = new Error(detail);
    error.status = response.status;
    throw error;
  }

  return (
    data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      ?.filter(Boolean)
      ?.join("\n") || "I could not generate a response right now."
  );
}

export async function POST(req) {
  try {
    const { messages } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key is not configured" },
        { status: 500 }
      );
    }

    const conversation = normalizeMessages(messages);
    const latestUserMessageText = extractLatestUserText(conversation);

    if (!latestUserMessageText) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    let reply = "";
    for (const modelName of buildModelCandidates()) {
      try {
        reply = await generateReplyForModel(modelName, conversation);
        break;
      } catch (error) {
        if (!shouldUseFallback(error)) {
          throw error;
        }

        reply = buildFallbackReply(latestUserMessageText);
        break;
      }
    }

    if (!reply) {
      return NextResponse.json(
        {
          reply: buildFallbackReply(latestUserMessageText),
          source: "fallback",
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ reply, source: "gemini" }, { status: 200 });
  } catch (error) {
    if (shouldUseFallback(error)) {
      return NextResponse.json(
        {
          reply: buildFallbackReply(""),
          source: "fallback",
        },
        { status: 200 }
      );
    }

    console.error("Gemini chat error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}
