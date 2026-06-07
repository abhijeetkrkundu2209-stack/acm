import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const storageDir = path.join(process.cwd(), ".data");
const storageFile = path.join(storageDir, "join-acm-applications.json");

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

async function readApplications() {
  await ensureStorageFile();
  const raw = await readFile(storageFile, "utf8");
  const applications = JSON.parse(raw || "[]");
  return Array.isArray(applications) ? applications : [];
}

async function writeApplications(applications) {
  await ensureStorageFile();
  await writeFile(storageFile, JSON.stringify(applications, null, 2), "utf8");
}

export async function createLocalJoinApplication(applicationData) {
  const now = new Date().toISOString();
  const applications = await readApplications();

  const application = {
    _id: randomUUID(),
    feeAmount: 10000,
    paymentStatus: "pending",
    razorpayOrderId: null,
    razorpayPaymentId: null,
    razorpaySignature: null,
    paidAt: null,
    createdAt: now,
    updatedAt: now,
    ...applicationData,
  };

  applications.push(application);
  await writeApplications(applications);
  return application;
}

export async function findLocalJoinApplicationById(applicationId) {
  if (!applicationId) {
    return null;
  }

  const applications = await readApplications();
  return applications.find((application) => application._id === String(applicationId)) || null;
}

export async function updateLocalJoinApplication(applicationId, updates) {
  const applications = await readApplications();
  const index = applications.findIndex((application) => application._id === String(applicationId));

  if (index === -1) {
    return null;
  }

  const existingApplication = applications[index];
  const updatedApplication = {
    ...existingApplication,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  applications[index] = updatedApplication;
  await writeApplications(applications);
  return updatedApplication;
}
