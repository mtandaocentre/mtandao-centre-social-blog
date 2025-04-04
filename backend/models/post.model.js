import { Schema } from "mongoose";
import mongoose from "mongoose";

const postSchema = new Schema(
  {
    // User
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Image
    img: {
      type: String,
    },

    // Title
    title: {
      type: String,
      required: true,
    },

    // Slug
    slug: {
      type: String,
      required: true,
      unique: true,
    },

    // Description
    desc: {
      type: String,
    },

    // Category
    category: {
      type: String,
      default: "general",
    },

    // Content
    content: {
      type: String,
      required: true,
    },

    // check if item is featured
    isFeatured: {
      type: Boolean,
      default: false,
    },

    // Check number of visits
    visit: {
      type: Number,
      default: 0,
    },

    // Likes count
    likes: [{ type: String }],
    
    // Share count
    shareCount: {
      type: Number,
      default: 0, // Default share count is 0
    }
  },

  // record time created
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);