import dbConnect from "@/lib/dbConnect";
import TestSubmission from "@/models/TestSubmission";
import {
  createLocalSubmission,
  findAllLocalSubmissions,
  findLocalSubmissionsByUserId,
} from "@/lib/localSubmissionStore";

function isMongoConnectionError(error) {
  const message = String(error?.message || "");
  return (
    error?.name === "MongoServerSelectionError" ||
    error?.name === "MongoNetworkError" ||
    error?.name === "MongooseServerSelectionError" ||
    /querySrv|ECONNREFUSED|ENOTFOUND|ECONNRESET|server selection/i.test(message)
  );
}

function shouldUseLocalFallback(error) {
  return process.env.NODE_ENV !== "production" && isMongoConnectionError(error);
}

function normalizeSubmission(submission) {
  if (!submission) {
    return submission;
  }

  return submission.toObject ? submission.toObject() : submission;
}

export async function createSubmission(submissionData) {
  try {
    await dbConnect();
    return normalizeSubmission(await TestSubmission.create(submissionData));
  } catch (error) {
    if (!shouldUseLocalFallback(error)) {
      throw error;
    }

    return createLocalSubmission(submissionData);
  }
}

export async function findUserSubmissions(userId) {
  try {
    await dbConnect();
    const submissions = await TestSubmission.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .select("studentName rollNumber subject score totalQuestions createdAt");

    return submissions.map(normalizeSubmission);
  } catch (error) {
    if (!shouldUseLocalFallback(error)) {
      throw error;
    }

    return findLocalSubmissionsByUserId(userId);
  }
}

export async function findAllSubmissions() {
  try {
    await dbConnect();
    const submissions = await TestSubmission.find({})
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    return submissions.map(normalizeSubmission);
  } catch (error) {
    if (!shouldUseLocalFallback(error)) {
      throw error;
    }

    return findAllLocalSubmissions();
  }
}
