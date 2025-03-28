import express from "express";
import { getUserSavedPosts, savePost, updateUserDescription } from "../controllers/user.controller.js";

// define router
const router = express.Router();

// Use router for api call
router.get("/saved", getUserSavedPosts);
router.patch("/save", savePost);

// New route for updating user description
router.patch("/description", updateUserDescription);

// Export router by default
export default router