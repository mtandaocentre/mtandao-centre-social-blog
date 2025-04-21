import mongoose, { Schema } from "mongoose";

// Word count validator function
const validateDescriptionLength = (value) => {
  const wordCount = value.trim().split(/\s+/).filter(Boolean).length;
  return wordCount <= 50;
};

const userSchema = new Schema(
  {
    // Clerk user ID
    clerkUserId: {
      type: String,
      required: true,
      unique: true,
    },

    // Username
    username: {
      type: String,
      required: true,
      unique: true,
    },

    // Email
    email: {
      type: String,
      required: true,
      unique: true,
    },

    // Profile image
    img: {
      type: String,
    },

    // Saved posts
    savedPosts: {
      type: [String],
      default: [],
    },

    // Bio/Description
    description: {
      type: String,
      default: "",
      validate: {
        validator: validateDescriptionLength,
        message: "Description must be no longer than 50 words.",
      },
    },

    // 🔗 Social media links
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    twitter: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    instagram: { type: String, default: "" },
    facebook: { type: String, default: "" },
    tiktok: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
