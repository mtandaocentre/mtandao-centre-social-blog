import mongoose from "mongoose";

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO);
        console.log("MongoDB is running")
    }catch(err){
        console.log(err)
    }
}

export default connectDB