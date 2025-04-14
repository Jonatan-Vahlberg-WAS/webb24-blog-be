require("dotenv").config()
const express = require("express");
const cors = require("cors")
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const app = express();
const port = 3000;
const MONGO_URL = process.env.MONGO_URI || "mongodb://localhost:27017/blog"

app.use(cors()) // cors
app.use(express.json()); // parse json bodies in the request
app.use(cookieParser()); // parse cookies
const authRoutes = require("./routes/auth.route")
const authCookieRoutes = require("./routes/auth-cookie.route")
app.use("/auth", authRoutes);
// app.use("/auth", authCookieRoutes);

const userRoutes = require("./routes/user.route")
app.use("/api/users", userRoutes)

const categoryRoutes = require("./routes/category.route")
app.use("/api/categories", categoryRoutes)

const postRoutes = require("./routes/post.route");
app.use("/api/posts", postRoutes);

const commentRoutes = require("./routes/comment.routes");
app.use("/api/comments", commentRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  if(process.env.NODE_ENV !== "test") {
    mongoose.connect(MONGO_URL)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.warn("Error connecting to MongoDB", err);
    });
  }
});

module.exports = app;
