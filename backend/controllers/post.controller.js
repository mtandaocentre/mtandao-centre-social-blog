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

    const query = {};

    const cat = req.query.cat;
    const author = req.query.author;
    const searchQuery = req.query.search;
    const sortQuery = req.query.sort;
    const featured = req.query.featured;

    if (cat) {
      query.category = cat;
    }

    if (searchQuery) {
      query.title = { $regex: searchQuery, $options: "i" }; 
    }

    if (author) {
      const user = await User.findOne({ username: author }).select("_id")

      if (!user) {
        return res.status(404).json("No post found!");
      }

      query.user = user._id;
    }

    let sortObj = { createdAt: -1 }

    if (sortQuery) {
      switch (sortQuery) {
        case "newest":
          sortObj = { createdAt: -1 }
          break;

        case "oldest":
          sortObj = { createdAt: 1 }
          break;

        case "popular":
          sortObj = { visit: -1 }
          break;

        case "trending":
          sortObj = { visit: -1 }
          query.createdAt = {
            $gte: new Date(new Date().getTime() -7 * 24 * 60 * 60 * 1000),
          }
          break;
      
        default:
          break;
      }
    }

    if(featured){
      query.isFeatured = true;
    }

    const posts = await Post.find(query)
  .populate(
    "user", 
    "username profilePic github linkedin twitter whatsapp instagram facebook tiktok telegram"
  )
  .sort(sortObj)
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
      .populate(
        "user", 
        "username img description github linkedin twitter whatsapp instagram facebook tiktok telegram"
      )
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
// UPDATE POST
// ---------------------
export const updatePost = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    if (!clerkUserId) return res.status(401).json("Not authenticated!");

    const { slug } = req.params; // <-- Use slug, not id
    const updates = req.body;

    const role = req.auth.sessionClaims?.metadata?.role || "user";

    // Find the post by slug
    const post = await Post.findOne({ slug });
    if (!post) return res.status(404).json("Post not found!");

    // If not admin, check if the post belongs to the user
    if (role !== "admin") {
      const user = await User.findOne({ clerkUserId });
      if (!user) return res.status(404).json("User not found!");
      if (post.user.toString() !== user._id.toString()) {
        return res.status(403).json("You can update only your own posts!");
      }
    }

    // Update the post
    const updatedPost = await Post.findOneAndUpdate(
      { slug },
      { $set: updates },
      { new: true }
    );

    res.status(200).json(updatedPost);
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

// ---------------------
// INCREMENT SHARE COUNT
// ---------------------
export const incrementShare = async (req, res) => {
  try {
    const { postId } = req.params;
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $inc: { shareCount: 1 } },
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Share count updated", shareCount: updatedPost.shareCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};