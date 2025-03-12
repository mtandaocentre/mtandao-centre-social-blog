import express from "express";
import { addComment, deleteComment, getPostComments } from "../controllers/comment.controller.js";


// Define router
const router = express.Router();

// Use router to make api call
router.get("/:postId", getPostComments)
router.post("/:postId", addComment)
router.delete("/:id", deleteComment)

// Export router
export default router