const Comment = require("../../models/comment.model");
const mongoose = require("mongoose");

describe("Comment Model", () => {
  const validCommentData = {
    content: "Test comment content",
    post: new mongoose.Types.ObjectId(),
    user: new mongoose.Types.ObjectId(),
  };

  test("should create a valid comment", async () => {
    const comment = await Comment.create(validCommentData);
    expect(comment.content).toBe(validCommentData.content);
    expect(comment.post.toString()).toBe(validCommentData.post.toString());
    expect(comment.user.toString()).toBe(validCommentData.user.toString());
    expect(comment.createdAt).toBeDefined();
    expect(comment.updatedAt).toBeDefined();
  });

  test("should fail to create comment without required fields", async () => {
    const invalidComment = new Comment({ content: "Test comment" });
    let err;
    try {
      await invalidComment.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.post).toBeDefined();
    expect(err.errors.user).toBeDefined();
  });
});
