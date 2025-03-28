import express from "express"
import connectDB from "./lib/connectDB.js"
import userRouter from "./routes/user.route.js"
import postRouter from "./routes/post.route.js"
import commentRouter from "./routes/comment.route.js"
import webhookRouter from "./routes/webhook.route.js"
import { clerkMiddleware, requireAuth } from "@clerk/express"
import cors from "cors"

// Create express app/server
const app = express();

// Set trust proxy at the very top
app.set("trust proxy", true);

// use cors middlewear to parse cliend url
app.use(cors(process.env.CLIENT_URL));

// Use clerkMiddleWare
app.use(clerkMiddleware());

// Use webhook end point to call webhook router
app.use("/webhooks", webhookRouter);

// Allow express to send json
app.use(express.json()); 

// middleware to allow cross-origin requests
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", 
      "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// test if .env can be accessed
// console.log(process.env.test)

// Test API request
// app.get("/test", (req,res) => {
//     res.status(200).send("API is working")
// })

// test auth-state end point
// app.get("/auth-state", (req, res) => {
    
//     const authState = req.auth;
//     res.json(authState); 

// });

// test protect end-point
// app.get("/protect", (req, res) => {
    
//     const {userId} = req.auth;
//     if(!userId){
//         return res.status(401).json("Not Authenticated!");
//     }

//     res.status(200).json("Thank you for verifying your authentication.");

// });

// test protect2 end-point
// app.get("/protect2", requireAuth(), (req, res) => {
    
//     res.status(200).json("Thank you for verifying your authentication.")

// });

// Use user router to get api
app.use("/users", userRouter);

// Use post router to get api
app.use("/posts", postRouter);

// Use post router to get api
app.use("/comments", commentRouter);

// Create end point error handler
app.use((error, req, res, next) => {

    res.status( error.status || 500 );

    res.json({
        message: error.message || "Something went wrong!",
        status: error.status,
        stack: error.stack
    });

});

// assign app port to listen to and report back
app.listen(3000, () => {
    connectDB()
    console.log("Server is running")
});
