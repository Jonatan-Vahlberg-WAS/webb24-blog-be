
const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

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

router.get("/admin/all/", adminMiddleware, async (req, res) => {
    try {
        const users = await User.find().select("-password")
        return res.json(users)
        
    } catch (error) {
        res.status(401).json({
            message: "Unauthorized"
        })
    }
})

module.exports = router