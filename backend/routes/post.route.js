import express from "express";
import { 
    getPosts, 
    getPost, 
    createPost,
    deletePost,
    uploadAuth,
    featurePost,
    likePost
} from "../controllers/post.controller.js";

// Define router
const router = express.Router();

// create upload-auth endpoint and use it to authenticate uploads
router.get("/upload-auth", uploadAuth);

// Use router to call api
// Create get method end point and use getPosts from post.conroller to get posts
router.get("/", getPosts);

// Create get method end point and use getPost from post.conroller to get single post
router.get("/:slug", getPost);

// create post method end point and use createPost from post.conroller to create a post
router.post("/", createPost);

// create delete method end point and use deletePost from post.conroller to delete a post
router.delete("/:id", deletePost);

// create featurePost method end point and use featurePost from post.conroller to feature a post
router.patch("/feature", featurePost);

// Like a post
router.post("/:postId/like", likePost);

// export default
export default router