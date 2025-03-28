import ImageKit from "imagekit";
import Post from "../models/post.model.js"
import User from "../models/user.model.js"
import View from "../models/view.model.js";

// Declare and export getPosts to fetch many posts
export const getPosts = async (req, res) => {

    // Define page and limit
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    
    // use page and limit to calculate posts, totalPost and hasMore
    const posts = await Post.find()
        .populate("user", "username")
        .limit(limit)
        .skip((page - 1) * limit);

    const totalPosts = await Post.countDocuments();
    const hasMore = page * limit < totalPosts;

    res.status(200).send({ posts, hasMore});

}

// Declare and export getPost to fetch single post
// Update getPost algo to only count one post per day from user
export const getPost = async (req, res) => {
    try {
      const { slug } = req.params;
      const post = await Post.findOne({ slug }).populate("user", "username img description");
  
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      // Determine the unique identifier: logged in user or client IP
      const userId = req.auth && req.auth.userId;
      const ip = req.ip; // Make sure app.set('trust proxy', true) is set if behind a proxy
  
      // Define the start of the current day
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
  
      // Check if this user/IP has already viewed the post today
      const existingView = await View.findOne({
        post: post._id,
        viewedAt: { $gte: todayStart },
        ...(userId ? { user: userId } : { ip }),
      });
  
      // If not, increment the view count and record the view
      if (!existingView) {
        await Post.findOneAndUpdate(
          { _id: post._id },
          { $inc: { visit: 1 } }
        );
  
        await new View({
          post: post._id,
          user: userId, // will be undefined if no user is logged in
          ip: userId ? undefined : ip,
        }).save();

        // Update the local post object so that it reflects the new view count
        post.visit += 1;

      }
  
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// Declare and export craetePost to create a post
export const createPost = async (req, res) => {

    // Check for clerkUserId before creating post
    const clerkUserId = req.auth.userId;

    console.log(req.headers);

    if (!clerkUserId) {
        return res.status(401).json("Not authenticated!");
    }

    const user = await User.findOne({ clerkUserId });

    if (!user) {
        return res.status(404).json("User not found!");
    }
    
    // generate slug
    let slug = req.body.title.replace(/ /g, "-").toLowerCase();

    // check if post exist
    let existingPost = await Post.findOne({ slug });

    // add counter 
    let counter = 2;

    // Create counter loop
    while (existingPost) {
        slug = `${slug}-${counter}`;
        existingPost = await Post.findOne({ slug });
        counter++;
    }

    // Create post
    const newPost = new Post({ user: user._id, slug, ...req.body });
   
    const post = await newPost.save();
    res.status(200).json(post);

}

// Declare and export deletePost to delete a post
export const deletePost = async (req, res) => {
   
    // Check for clerkUserId before creating post
    const clerkUserId = req.auth.userId;
 
    if (!clerkUserId) {
        return res.status(401).json("Not authenticated!");
    }

    const role = req.auth.sessionClaims?.metadata?.role || "user";

    if(role === "admin"){
        await Post.findByIdAndDelete(req.params.id);
        return res.status(200).json("Post has been deleted successfully!");
    }
 
    const user = await User.findOne({ clerkUserId });

    const deletedPost = await Post.findOneAndDelete({
        _id: req.params.id,
        user: user._id,
    });

    if (!deletedPost) {
        return res.status(403).json("You can delete only your posts!");
    }
    
    res.status(200).json("Post has been deleted successfully!");

};

// Declare and export featurePost to feature a post
export const featurePost = async (req, res) => {
    const clerkUserId = req.auth.userId;
    const postId = req.body.postId;
  
    if (!clerkUserId) {
      return res.status(401).json("Not authenticated!");
    }
  
    const role = req.auth.sessionClaims?.metadata?.role || "user";
  
    if (role !== "admin") {
      return res.status(403).json("You cannot feature posts!");
    }
  
    const post = await Post.findById(postId);
  
    if (!post) {
      return res.status(404).json("Post not found!");
    }
  
    const isFeatured = post.isFeatured;
  
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        isFeatured: !isFeatured,
      },
      { new: true }
    );
  
    res.status(200).json(updatedPost);
};  

//Define imagekit and auth parametres
const imagekit = new ImageKit({
    urlEndpoint: process.env.IK_URL_ENDPOINT, 
    publicKey: process.env.IK_PUBLIC_KEY,
    privateKey: process.env.IK_PRIVATE_KEY,
});

// Create and export uploadauth function
export const uploadAuth = async (req, res) => {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
}
