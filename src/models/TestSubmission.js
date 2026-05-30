import mongoose from "mongoose";

const TestSubmissionSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true, trim: true },
    rollNumber: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    answers: { type: Object, required: true }, // key: question index, value: selected option
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional, if logged in
  },
  { timestamps: true }
);

export default mongoose.models.TestSubmission || mongoose.model("TestSubmission", TestSubmissionSchema);
