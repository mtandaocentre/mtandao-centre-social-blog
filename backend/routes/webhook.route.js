import express from "express";
import { clerkWebHook } from "../controllers/webhook.controller.js";
import bodyParser from "body-parser"

// define router
const router = express.Router();

// Create clerk endpoint
// Add body parser middle wear
router.post("/clerk", bodyParser.raw({ type: 'application/json' }), clerkWebHook);

// Export router by default
export default router