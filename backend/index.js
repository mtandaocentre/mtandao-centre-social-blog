import express from "express";
import connectDB from "./lib/connectDB.js";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import commentRouter from "./routes/comment.route.js";
import webhookRouter from "./routes/webhook.route.js";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import cors from "cors";
import path from 'path';

// Create express app/server
const app = express();

// Set trust proxy at the very top (this helps with handling proxy setups, like Heroku)
app.set("trust proxy", true);

// CORS Middleware setup: Ensure the CORS policy allows the client URL from the environment variable
app.use(cors({
  origin: process.env.CLIENT_URL  // This will use your .env variable CLIENT_URL for production
}));

// Use Clerk middleware to authenticate users globally
app.use(clerkMiddleware());

// Use webhook endpoint to handle webhook requests
app.use("/webhooks", webhookRouter);

// Allow express to parse incoming JSON requests
app.use(express.json());

// Middleware to allow cross-origin requests (you can keep this or remove if CORS middleware is sufficient)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", 
      "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Use user router to manage user-related API routes (protected by requireAuth)
app.use("/users", userRouter); // Protecting user routes at the route level with requireAuth()

// Use post router for managing posts
app.use("/posts", postRouter);

// Use comment router for managing comments
app.use("/comments", commentRouter);

// Error handler middleware: Handles errors across the app
app.use((error, req, res, next) => {
    console.error(error); // Log the error
    res.status(error.status || 500).json({
        message: error.message || "Something went wrong!",
        status: error.status,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
});

// Start the server and connect to MongoDB
app.listen(3000, () => {
    connectDB(); // Connect to the database
    console.log("Server is running on port 3000");
});
