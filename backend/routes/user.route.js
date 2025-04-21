import express from "express";
import multer from "multer";
import { 
  getCurrentUser, 
  getUserSavedPosts, 
  savePost, 
  updateUserDescription,
  updateUserById,
  getUserById
} from "../controllers/user.controller.js";

const router = express.Router();

// Set up multer to use memory storage (for base64 or cloud uploads)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Apply multer to this route
router.patch("/:userId", upload.single("profilePic"), updateUserById);

// Existing routes
router.get("/saved", getUserSavedPosts);
router.patch("/save", savePost);
router.patch("/description", updateUserDescription);
router.get("/me", getCurrentUser);
router.get("/:userId", getUserById); // 👈 Add this

export default router;
