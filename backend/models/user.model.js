import mongoose, { Schema } from "mongoose";

// Word count validator function
const validateDescriptionLength = (value) => {
  const wordCount = value.trim().split(/\s+/).filter(Boolean).length; // Count words, trimming whitespace
  return wordCount <= 50;  // Ensure no more than 50 words
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

    // Image
    img: {
      type: String,
    },

    // Saved posts (array of post IDs or other references)
    savedPosts: {
      type: [String],
      default: [],
    },

    // Author description with word limit validation
    description: {
      type: String,
      default: "",  // or use a default text if preferred
      validate: {
        validator: validateDescriptionLength,
        message: "Description must be no longer than 50 words.",
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
