import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import {
  createLocalUser,
  findLocalUserByEmail,
  findLocalUserById,
} from "@/lib/localAuthStore";

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

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export async function findAuthUserByEmail(email) {
  const normalizedEmail = normalizeEmail(email);

  try {
    await dbConnect();
    return await User.findOne({ email: normalizedEmail });
  } catch (error) {
    if (!shouldUseLocalFallback(error)) {
      throw error;
    }

    return findLocalUserByEmail(normalizedEmail);
  }
}

export async function findAuthUserById(userId) {
  try {
    await dbConnect();
    return await User.findById(userId);
  } catch (error) {
    if (!shouldUseLocalFallback(error)) {
      throw error;
    }

    return findLocalUserById(userId);
  }
}

export async function createAuthUser(userData) {
  try {
    await dbConnect();
    return await User.create(userData);
  } catch (error) {
    if (!shouldUseLocalFallback(error)) {
      throw error;
    }

    return createLocalUser(userData);
  }
}
