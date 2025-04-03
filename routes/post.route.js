const express = require("express");
const router = express.Router();
const Post = require("../models/post.model");
const Category = require("../models/category.model");

const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", async (req, res) => {
    const user = req.query.user
    const category = req.query.category
    const filter = {}
    if(user) {
        console.log("Filtering based on user id")
        filter.user = user
    }
    if(category) {
        const _category = await Category.findOne({ slug: category })
        console.log("Category", _category)
        console.log("Filtering based on category id")
        if(_category) {
            filter.categories = _category._id
        }
    }
    try {
        const posts = await Post.find(filter).populate(["user", "categories"]);
        res.status(200).json(posts);
    } catch (error) {
        console.warn("Error fetching posts", error);
        res.json([])
    }
});

router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate(["user", "categories"]);
        if (!post) {
            throw new Error("Post not found");
        }
        res.status(200).json(post);
    } catch (error) {
        console.warn("Error fetching post", error);
        res.status(404).json({ message: "Post not found" });
    }
});

router.post("/", authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;

        const newPost = {
            title: req.body.title,
            content: req.body.content,
            user: userId,
            categories: []
        }

        const post = await Post.create(newPost)
        res.status(201).json(post);
    } catch (error) {
        console.warn("Error creating post", error);
        res.status(500).json({ message: error.message });
    }
});

router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const post = await Post.findOne({
            _id: req.params.id,
            user: req.userId
        })

        post.title = req.body.title || post.title
        post.content = req.body.content || post.content
        post.categories = req.body.categories || post.categories || []

        await post.save()

        if (!post) {
            throw new Error("Post not found");
        }
        res.status(200).json(post);
    } catch (error) {
        console.warn("Error updating post", error);
        res.status(404).json({ message: "Post not found" });
    }
});

router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const filter = {
            _id: req.params.id
        }
        if(!req.isAdmin) {
            filter.user = req.userId
        }
        console.log("FILTER", filter)
        const post = await Post.findOneAndDelete(filter)
        if (!post) {
            throw new Error("Post not found");
        }
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.warn("Error deleting post", error);
        res.status(404).json({ message: "Post not found" });
    }
});

module.exports = router;