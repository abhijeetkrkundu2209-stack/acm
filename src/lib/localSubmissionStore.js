import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const storageDir = path.join(process.cwd(), ".data");
const storageFile = path.join(storageDir, "test-submissions.json");

async function ensureStorageFile() {
  await mkdir(storageDir, { recursive: true });

  try {
    await readFile(storageFile, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") {
      await writeFile(storageFile, "[]", "utf8");
      return;
    }

    throw error;
  }
}

async function readSubmissions() {
  await ensureStorageFile();
  const raw = await readFile(storageFile, "utf8");
  const submissions = JSON.parse(raw || "[]");
  return Array.isArray(submissions) ? submissions : [];
}

async function writeSubmissions(submissions) {
  await ensureStorageFile();
  await writeFile(storageFile, JSON.stringify(submissions, null, 2), "utf8");
}

export async function createLocalSubmission(submissionData) {
  const now = new Date().toISOString();
  const submissions = await readSubmissions();

  const submission = {
    _id: randomUUID(),
    createdAt: now,
    updatedAt: now,
    ...submissionData,
  };

  submissions.push(submission);
  await writeSubmissions(submissions);
  return submission;
}

export async function findLocalSubmissionsByUserId(userId) {
  const submissions = await readSubmissions();
  return submissions
    .filter((submission) => String(submission.createdBy || "") === String(userId))
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
}

export async function findAllLocalSubmissions() {
  const submissions = await readSubmissions();
  return submissions.sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
}
