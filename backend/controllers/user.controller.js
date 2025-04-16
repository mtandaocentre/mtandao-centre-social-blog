import User from "../models/user.model.js"

export const getUserSavedPosts = async (req, res) => {
        
    const clerkUserId = req.auth.userId;

    if(!clerkUserId){
        return res.status(401).json("Sign in to perform this action!");
    };

    const user = await User.findOne({clerkUserId});

    res.status(200).json(user.savedPosts);
    
}

export const savePost = async (req, res) => {
         
    const clerkUserId = req.auth.userId;
    const postId = req.body.postId;

    if(!clerkUserId){
        return res.status(401).json("Sign in first, to perform this action!");
    };

    const user = await User.findOne({clerkUserId});

    const isSaved = user.savedPosts.some((p) => p === postId);

    if(!isSaved){
        await User.findByIdAndUpdate(user._id,{
            $push: { savedPosts: postId },
        });
    } else {
        await User.findByIdAndUpdate(user._id,{
            $pull: { savedPosts: postId },
        });
    };

    setTimeout(() => {
        res.status(200).json(isSaved? "Post Unsaved" : "Post Saved");
    }, 3000)

}

// New controller function to update user description
export const updateUserDescription = async (req, res) => {
    const clerkUserId = req.auth.userId;
    const { description } = req.body;
    // console.log("Updating description to:", description); // Debug log
  
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

  export const getCurrentUser = async (req, res) => {
    const clerkUserId = req.auth.userId;
  
    if (!clerkUserId) {
      return res.status(401).json("Sign in to perform this action!");
    }
  
    try {
      const user = await User.findOne({ clerkUserId }).select("username email img description savedPosts");
  
      if (!user) {
        return res.status(404).json("User not found!");
      }
  
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  