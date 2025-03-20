const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // This automatically adds createdAt and updatedAt fields
  }
);

commentSchema.set("toJSON", { virtuals: true });

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
