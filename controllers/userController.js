import express from "express";
import User from "../models/user.js";

const router = express.Router();

router.post("/register", async (req,res) => {
    const user = await User.register(req.body);
    console.log(`>> New user ${user.name} with ID ${user._id} saved to database.`);
    res.status(201);
    res.json({
        _id: user.id,
        name: user.name,
        email: user.email
    })
})

export default router;