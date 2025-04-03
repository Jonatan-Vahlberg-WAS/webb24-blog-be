const bcrypt = require("bcrypt");
const express = require("express");

const router = express.Router();

const User = require("../models/user.model");
const { generateAccessJWT, verifyAccessToken } = require("../utils/jwt");

router.post("/register/", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(200).json({
      message: "User registered correctly",
    });
  } catch (error) {
    console.warn("Error registring user", error);
    res.status(400).json({
      error: "User unable to register",
    });
  }
});

router.post("/login/", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new Error("User not found");
    }
    const isPasswordSame = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordSame) {
      throw new Error("User not found");
    }

    // Generate JWT token
    const token = generateAccessJWT({
      userId: user._id,
      email: user.email,
    });

    // Set HTTP-only cookie with JWT token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.json({
      message: "Login successful",
    });
  } catch (error) {
    console.warn("Error logging in user", error);
    res.status(400).json({
      error: "User unable to login",
    });
  }
});

// Update logout route
router.post("/logout/", (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "Logged out successfully",
  });
});

module.exports = router;
