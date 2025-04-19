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

    // Fetch the posts using the post IDs from savedPosts field in User model
    const savedPosts = await Post.find({
      _id: { $in: user.savedPosts },
    }).select("title desc"); // Select title and description for each post

    if (!savedPosts || savedPosts.length === 0) {
      return res.status(404).json("No saved posts found!");
    }

    // Send the saved posts along with the title and description
    res.status(200).json(savedPosts);
  } catch (error) {
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
      "username email img description savedPosts"
    );

    if (!user) {
      return res.status(404).json("User not found!");
    }

    // Fetch the posts using the post IDs from savedPosts field in User model
    const savedPosts = await Post.find({
      _id: { $in: user.savedPosts },
    }).select("title desc"); // Select title and description for each post

    // Combine user data with saved posts data
    const userProfile = {
      ...user.toObject(),
      imageUrl: user.img,
      savedPosts: savedPosts, // Attach savedPosts with full details
    };

    res.status(200).json(userProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserById = async (req, res) => {
  const authUserId = req.auth?.userId;
  const { userId } = req.params;
  const { username, description } = req.body;
  const profilePic = req.file; // multer adds this

  console.log("Auth User ID:", authUserId);
  console.log("Updating Mongo User ID:", userId);
  console.log("New values:", { username, description });

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

    const updateData = {
      username,
      description,
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




