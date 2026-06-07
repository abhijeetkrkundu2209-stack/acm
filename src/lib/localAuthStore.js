import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const storageDir = path.join(process.cwd(), ".data");
const storageFile = path.join(storageDir, "local-auth-users.json");

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

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

async function readUsers() {
  await ensureStorageFile();
  const raw = await readFile(storageFile, "utf8");
  const users = JSON.parse(raw || "[]");
  return Array.isArray(users) ? users : [];
}

async function writeUsers(users) {
  await ensureStorageFile();
  await writeFile(storageFile, JSON.stringify(users, null, 2), "utf8");
}

export async function findLocalUserByEmail(email) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    return null;
  }

  const users = await readUsers();
  return users.find((user) => user.email === normalizedEmail) || null;
}

export async function findLocalUserById(userId) {
  if (!userId) {
    return null;
  }

  const users = await readUsers();
  return users.find((user) => user._id === String(userId)) || null;
}

export async function createLocalUser({ name, email, password, role = "user" }) {
  const normalizedEmail = normalizeEmail(email);
  const users = await readUsers();

  if (users.some((user) => user.email === normalizedEmail)) {
    const error = new Error("A user with this email already exists");
    error.statusCode = 400;
    throw error;
  }

  const now = new Date().toISOString();
  const user = {
    _id: randomUUID(),
    name: String(name || "").trim(),
    email: normalizedEmail,
    password,
    role: role === "admin" ? "admin" : "user",
    createdAt: now,
    updatedAt: now,
  };

  users.push(user);
  await writeUsers(users);

  return user;
}
