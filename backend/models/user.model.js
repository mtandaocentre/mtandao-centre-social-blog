import { Schema } from "mongoose";
import mongoose from "mongoose";

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

    // email
    email: {
      type: String,
      required: true,
      unique: true,
    },

    // image
    img: {
      type: String,
    },

    //saved posts
    savedPosts: {
      type: [String],
      default: [],
    },

    // Author description
    description: {
      type: String,
      default: "",  // or use a default text if preferred
    },
  },

  // Time created
  { timestamps: true }
);

export default mongoose.model("User", userSchema);