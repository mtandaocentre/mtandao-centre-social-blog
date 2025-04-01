import ImageKit from "imagekit";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import View from "../models/view.model.js";
import mongoose from "mongoose";

// ---------------------
// GET POSTS
// ---------------------
export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;

    const posts = await Post.find()
      .populate("user", "username")
      .limit(limit)
      .skip((page - 1) * limit);

    const totalPosts = await Post.countDocuments();
    const hasMore = page * limit < totalPosts;

    res.status(200).send({ posts, hasMore });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------
// GET SINGLE POST
// ---------------------
export const getPost = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await Post.findOne({ slug })
      .populate("user", "username img description")
      .populate("likes", "username");

    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.auth && req.auth.userId;
    const ip = req.ip; // Ensure trust proxy is set if behind a proxy

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const existingView = await View.findOne({
      post: post._id,
      viewedAt: { $gte: todayStart },
      ...(userId ? { user: userId } : { ip }),
    });

    if (!existingView) {
      await Post.findOneAndUpdate(
        { _id: post._id },
        { $inc: { visit: 1 } }
      );

      await new View({
        post: post._id,
        user: userId, // may be undefined if not logged in
        ip: userId ? undefined : ip,
      }).save();

      post.visit += 1;
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------
// CREATE POST
// ---------------------
export const createPost = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    if (!clerkUserId) return res.status(401).json("Not authenticated!");

    const user = await User.findOne({ clerkUserId });
    if (!user) return res.status(404).json("User not found!");

    let slug = req.body.title.replace(/ /g, "-").toLowerCase();
    let existingPost = await Post.findOne({ slug });
    let counter = 2;

    while (existingPost) {
      slug = `${slug}-${counter}`;
      existingPost = await Post.findOne({ slug });
      counter++;
    }

    const newPost = new Post({ user: user._id, slug, ...req.body });
    const post = await newPost.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------
// DELETE POST
// ---------------------
export const deletePost = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    if (!clerkUserId) return res.status(401).json("Not authenticated!");

    const role = req.auth.sessionClaims?.metadata?.role || "user";
    if (role === "admin") {
      await Post.findByIdAndDelete(req.params.id);
      return res.status(200).json("Post has been deleted successfully!");
    }

    const user = await User.findOne({ clerkUserId });
    const deletedPost = await Post.findOneAndDelete({
      _id: req.params.id,
      user: user._id,
    });

    if (!deletedPost)
      return res.status(403).json("You can delete only your posts!");

    res.status(200).json("Post has been deleted successfully!");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------
// FEATURE POST
// ---------------------
export const featurePost = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    const postId = req.body.postId;
    if (!clerkUserId) return res.status(401).json("Not authenticated!");

    const role = req.auth.sessionClaims?.metadata?.role || "user";
    if (role !== "admin") return res.status(403).json("You cannot feature posts!");

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json("Post not found!");

    const isFeatured = post.isFeatured;
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { isFeatured: !isFeatured },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------
// UPLOAD AUTH
// ---------------------
const imagekit = new ImageKit({
  urlEndpoint: process.env.IK_URL_ENDPOINT,
  publicKey: process.env.IK_PUBLIC_KEY,
  privateKey: process.env.IK_PRIVATE_KEY,
});

export const uploadAuth = async (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
};

// ---------------------
// LIKE POST
// ---------------------
export const likePost = async (req, res) => {
    try {
      // Get the Clerk user ID directly from req.auth
      const clerkUserId = req.auth?.userId;
      if (!clerkUserId) {
        return res.status(401).json({ message: "Not authenticated!" });
      }
  
      // Use 'postId' from params.
      const { postId } = req.params;
      if (!postId) {
        return res.status(400).json({ message: "Missing postId" });
      }
  
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      // Check if the Clerk user ID is already in the likes array.
      const hasLiked = post.likes.includes(clerkUserId);
  
      if (hasLiked) {
        // Remove the like if already liked.
        post.likes = post.likes.filter((id) => id !== clerkUserId);
      } else {
        // Add the Clerk user ID to the likes array.
        post.likes.push(clerkUserId);
      }
  
      await post.save();
  
      // Respond with the new likes count and liked status.
      res.status(200).json({ likes: post.likes.length, liked: !hasLiked });
    } catch (error) {
      console.error("Error in likePost:", error);
      res.status(500).json({ message: "Error processing like", error: error.message });
    }
  };