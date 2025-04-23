import User from "../models/user.model.js";
import Post from "../models/post.model.js"; // Import Post model

export const getUserSavedPosts = async (req, res) => {
  const clerkUserId = req.auth.userId;

  if (!clerkUserId) {
    return res.status(401).json("Sign in to perform this action!");
  }

  try {
    const user = await User.findOne({ clerkUserId });

    if (!user) {
      return res.status(404).json("User not found!");
    }

    const savedPosts = await Post.find({
      _id: { $in: user.savedPosts },
    })
      .select("title desc slug category img createdAt user") // 👈 select relevant fields
      .populate({
        path: "user", // 👈 this is your author field
        select: "username", // 👈 include author name
      });

    if (!savedPosts || savedPosts.length === 0) {
      return res.status(404).json("No saved posts found!");
    }

    res.status(200).json(savedPosts);
  } catch (error) {
    console.error("Error fetching saved posts:", error);
    res.status(500).json({ message: error.message });
  }
};

export const savePost = async (req, res) => {
  const clerkUserId = req.auth.userId;
  const postId = req.body.postId;

  if (!clerkUserId) {
    return res.status(401).json("Sign in first, to perform this action!");
  }

  const user = await User.findOne({ clerkUserId });

  const isSaved = user.savedPosts.some((p) => p === postId);

  if (!isSaved) {
    await User.findByIdAndUpdate(user._id, {
      $push: { savedPosts: postId },
    });
  } else {
    await User.findByIdAndUpdate(user._id, {
      $pull: { savedPosts: postId },
    });
  }

  setTimeout(() => {
    res.status(200).json(isSaved ? "Post Unsaved" : "Post Saved");
  }, 3000);
};

export const updateUserDescription = async (req, res) => {
  const clerkUserId = req.auth.userId;
  const { description } = req.body;

  if (!clerkUserId) {
    return res.status(401).json("Sign in to perform this action!");
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { clerkUserId },
      { description },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json("User not found!");
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATED: getCurrentUser with imageUrl field
export const getCurrentUser = async (req, res) => {
  const clerkUserId = req.auth.userId;

  if (!clerkUserId) {
    return res.status(401).json("Sign in to perform this action!");
  }

  try {
    const user = await User.findOne({ clerkUserId }).select(
      "username email img description savedPosts github linkedin twitter whatsapp instagram facebook tiktok"
    );

    if (!user) {
      return res.status(404).json("User not found!");
    }

    // ✅ Populate saved posts with post author and optional category
    const savedPosts = await Post.find({
      _id: { $in: user.savedPosts },
    })
      .select("img title desc slug category createdAt user")
      .populate({
        path: "user",
        select: "username",
      })
      .populate({
        path: "category", // if you have this in your post schema
        select: "name",
      });

    const userProfile = {
      ...user.toObject(),
      imageUrl: user.img,
      savedPosts,
    };

    res.status(200).json(userProfile);
  } catch (error) {
    console.error("getCurrentUser error:", error);
    res.status(500).json({ message: error.message });
  }
};


export const updateUserById = async (req, res) => {
  const authUserId = req.auth?.userId;
  const { userId } = req.params;
  const { 
    username, 
    description, 
    github, 
    linkedin, 
    twitter, 
    whatsapp, 
    instagram, 
    facebook, 
    tiktok, 
    telegram 
  } = req.body;
  const profilePic = req.file; // multer adds this

  console.log("Auth User ID:", authUserId);
  console.log("Updating Mongo User ID:", userId);
  console.log("New values:", { 
    username, 
    description, 
    github, 
    linkedin, 
    twitter, 
    whatsapp, 
    instagram, 
    facebook, 
    tiktok, 
    telegram 
  });

  if (!authUserId) {
    return res.status(401).json("Sign in to perform this action!");
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json("User not found!");
    }

    if (user.clerkUserId !== authUserId) {
      return res.status(403).json("You are not authorized to update this user.");
    }

    let img;
    if (profilePic) {
      img = `data:${profilePic.mimetype};base64,${profilePic.buffer.toString("base64")}`;
    }

    // Prepare the update data including social links
    const updateData = {
      username,
      description,
      github,
      linkedin,
      twitter,
      whatsapp,
      instagram,
      facebook,
      tiktok,
      telegram,
      ...(img && { img }), // only include img if there’s a new profilePic
    };

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select(
      "username email img description github linkedin twitter whatsapp instagram facebook tiktok telegram"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      ...user.toObject(),
      imageUrl: user.img, // 🔄 normalize for frontend
    });
  } catch (err) {
    console.error("Error getting user by ID:", err);
    res.status(500).json({ message: "Server error" });
  }
};






