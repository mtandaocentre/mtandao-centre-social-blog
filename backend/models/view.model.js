import mongoose, { Schema } from "mongoose";

const viewSchema = new Schema({
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  // If the user is logged in, record their user ID; otherwise, store their IP.
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  ip: {
    type: String,
    required: false,
  },
  viewedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("View", viewSchema);
