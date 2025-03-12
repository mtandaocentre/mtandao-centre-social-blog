import { Schema } from "mongoose";
import mongoose from "mongoose";

// Create comment schema
const commentSchema = new Schema({
    // Add user information when new comment is added
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // Add post information for which comment belongs to
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },

    // Description    
    desc: {
            type: String,
            required: true,
        },
    }, 

    // Updates created time
    {timestamps: true}
);

export default mongoose.model("Comment", commentSchema);