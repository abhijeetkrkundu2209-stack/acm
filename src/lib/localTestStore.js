import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const storageDir = path.join(process.cwd(), ".data");
const storageFile = path.join(storageDir, "tests.json");

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

async function readTests() {
  await ensureStorageFile();
  const raw = await readFile(storageFile, "utf8");
  const tests = JSON.parse(raw || "[]");
  return Array.isArray(tests) ? tests : [];
}

async function writeTests(tests) {
  await ensureStorageFile();
  await writeFile(storageFile, JSON.stringify(tests, null, 2), "utf8");
}

export async function findAllLocalTests() {
  const tests = await readTests();
  return tests.sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
}

export async function findActiveLocalTests() {
  const tests = await readTests();
  return tests
    .filter((test) => test.isActive !== false)
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
}

export async function createLocalTest(testData) {
  const now = new Date().toISOString();
  const tests = await readTests();

  const test = {
    _id: randomUUID(),
    title: String(testData.title || "").trim(),
    subject: String(testData.subject || "").trim(),
    duration: Number(testData.duration) || 20,
    price: Number(testData.price) || 0,
    isPaid: Boolean(testData.isPaid),
    questions: Array.isArray(testData.questions) ? testData.questions : [],
    isActive: testData.isActive !== false,
    createdBy: testData.createdBy || null,
    createdAt: now,
    updatedAt: now,
  };

  tests.push(test);
  await writeTests(tests);
  return test;
}

export async function deleteLocalTest(testId) {
  const tests = await readTests();
  const nextTests = tests.filter((test) => test._id !== String(testId));

  if (nextTests.length === tests.length) {
    return null;
  }

  await writeTests(nextTests);
  return true;
}
