import dbConnect from "@/lib/dbConnect";
import Test from "@/models/Test";
import {
  createLocalTest,
  deleteLocalTest,
  findActiveLocalTests,
  findAllLocalTests,
} from "@/lib/localTestStore";

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

function normalizeTest(test) {
  return test?.toObject ? test.toObject() : test;
}

export async function findPublicTests() {
  try {
    await dbConnect();
    const tests = await Test.find({ isActive: true })
      .select("title subject duration questions isPaid price")
      .sort({ createdAt: -1 });

    return tests.map(normalizeTest);
  } catch (error) {
    if (!shouldUseLocalFallback(error)) {
      throw error;
    }

    const tests = await findActiveLocalTests();
    return tests.map((test) => ({
      _id: test._id,
      title: test.title,
      subject: test.subject,
      duration: test.duration,
      questions: test.questions,
      isPaid: test.isPaid,
      price: test.price,
    }));
  }
}

export async function findAdminTests() {
  try {
    await dbConnect();
    const tests = await Test.find({}).sort({ createdAt: -1 });
    return tests.map(normalizeTest);
  } catch (error) {
    if (!shouldUseLocalFallback(error)) {
      throw error;
    }

    return findAllLocalTests();
  }
}

export async function createTest(testData) {
  try {
    await dbConnect();
    return normalizeTest(await Test.create(testData));
  } catch (error) {
    if (!shouldUseLocalFallback(error)) {
      throw error;
    }

    return createLocalTest(testData);
  }
}

export async function deleteTest(testId) {
  try {
    await dbConnect();
    const deleted = await Test.findByIdAndDelete(testId);
    return deleted ? normalizeTest(deleted) : null;
  } catch (error) {
    if (!shouldUseLocalFallback(error)) {
      throw error;
    }

    return deleteLocalTest(testId);
  }
}
