const express = require("express");
const router = express.Router();
const Comment = require("../models/comment.model");
const authMiddleware = require("../middlewares/authMiddleware");

// Get all comments for a specific post
router.get("/posts/:postId/comments", async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "name")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new comment
router.post("/posts/:postId/comments", authMiddleware, async (req, res) => {
  try {
    const comment = new Comment({
      content: req.body.content,
      post: req.params.postId,
      user: req.userId
    });
    const newComment = await comment.save();
    await newComment.populate("user", "name email");
    res.status(201).json(newComment);
  } catch (error) {
    console.warn(error);
    res.status(400).json({ message: error.message });
  }
});

// Update a comment
router.put("/:commentId", authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findOne({
      _id: req.params.commentId,
      user: req.userId
    })
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.content = req.body.content;
    const updatedComment = await comment.save();
    await updatedComment.populate("user", "name email");
    res.json(updatedComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a comment
router.delete("/:commentId", async (req, res) => {
  try {
    const comment = await Comment.findOne({
      _id: req.params.commentId,
      user: req.userId
    })
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
