import express from "express";
import { getUserSavedPosts, savePost } from "../controllers/user.controller";

// define router
const router = express.Router();

// Use router for api call
router.get("/saved", getUserSavedPosts);
router.patch("/save", savePost);

// Export router by default
export default router