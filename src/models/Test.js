import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "Please provide a question"],
    trim: true,
  },
  options: {
    type: [String],
    validate: {
      validator: (v) => v.length === 4,
      message: "Each question must have exactly 4 options",
    },
    required: true,
  },
  answer: {
    type: String,
    required: [true, "Please provide the correct answer"],
    trim: true,
  },
});

const TestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a test title"],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, "Please provide a subject"],
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
      default: 20, // minutes
    },
    price: {
      type: Number,
      default: 0,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    questions: {
      type: [QuestionSchema],
      validate: {
        validator: (v) => v.length > 0,
        message: "A test must have at least one question",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Test || mongoose.model("Test", TestSchema);
