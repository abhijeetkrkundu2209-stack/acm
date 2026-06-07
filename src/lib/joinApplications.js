import dbConnect from "@/lib/dbConnect";
import JoinACMApplication from "@/models/JoinACMApplication";
import {
  createLocalJoinApplication,
  findLocalJoinApplicationById,
  updateLocalJoinApplication,
} from "@/lib/localJoinStore";

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

export async function createJoinApplication(applicationData) {
  try {
    await dbConnect();
    return await JoinACMApplication.create(applicationData);
  } catch (error) {
    if (!shouldUseLocalFallback(error)) {
      throw error;
    }

    return createLocalJoinApplication(applicationData);
  }
}

export async function findJoinApplicationById(applicationId) {
  try {
    await dbConnect();
    return await JoinACMApplication.findById(applicationId);
  } catch (error) {
    if (!shouldUseLocalFallback(error)) {
      throw error;
    }

    return findLocalJoinApplicationById(applicationId);
  }
}

export async function updateJoinApplication(applicationId, updates) {
  try {
    await dbConnect();
    return await JoinACMApplication.findByIdAndUpdate(applicationId, updates, {
      new: true,
    });
  } catch (error) {
    if (!shouldUseLocalFallback(error)) {
      throw error;
    }

    return updateLocalJoinApplication(applicationId, updates);
  }
}
