const { loadEnvConfig } = require("@next/env");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Load Next.js env variables from .env.local
loadEnvConfig(process.cwd());

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@acm.org";
const ADMIN_PASSWORD = "AdminPassword123#"; // Default secure seed password

if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI is not defined in your environment variables.");
  process.exit(1);
}

// Inline schema to prevent ESM import mismatch in standalone script
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function seedAdmin() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully.");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      console.log(`Admin user with email "${ADMIN_EMAIL}" already exists.`);
      console.log("Skipping seeding.");
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    // Create Admin
    const admin = new User({
      name: "ACM Administrator",
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin"
    });

    await admin.save();
    console.log("\n=========================================");
    console.log("🎉 ADMIN USER SEEDED SUCCESSFULLY 🎉");
    console.log(`Email:    ${ADMIN_EMAIL}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
    console.log("=========================================\n");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

seedAdmin();
