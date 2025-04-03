
const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/me", authMiddleware, async (req, res) => {
    const userId = req.userId;
    try {
        const user = await User.findById(userId).select("-password")
        if(!user) {
            throw new Error("Unauthorized")
        }
        return res.json(user)
        
    } catch (error) {
        res.status(401).json({
            message: "Unauthorized"
        })
        
    }
})

module.exports = router