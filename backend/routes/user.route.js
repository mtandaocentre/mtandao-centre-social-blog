import express from "express";

// define router
const router = express.Router();

// Use router for api call
router.get("/usertest", (req,res) => {
    res.status(200).send("User Route")
})

// Export router by default
export default router