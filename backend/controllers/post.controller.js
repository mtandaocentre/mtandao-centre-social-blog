import ImageKit from "imagekit";
import Post from "../models/post.model.js"
import User from "../models/user.model.js"

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
export const getPost = async (req, res) => {
    
    const post = await Post.findOne({ slug: req.params.slug }).populate(
        "user",
        "username img"
    );
    res.status(200).send(post);

}

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
        res.status(200).json("Post has been deleted successfully!");
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
