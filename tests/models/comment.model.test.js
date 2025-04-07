const Comment = require("../../models/comment.model");
const UserFactory = require("../factories/user.factory");
const PostFactory = require("../factories/post.factory");

describe("Comment Model", () => {
  beforeEach(async function () {
    const user = await UserFactory.create();
    const post = await PostFactory.create();
    this.user = user;
    this.post = post;
  });

  let validCommentData = {
    content: "Test comment content",
  }

  test("should create a valid comment", async function () {
    const comment = await Comment.create({
      ...validCommentData,
      post: this.post._id,
      user: this.user._id,
    });
    expect(comment.content).toBe(validCommentData.content);
    expect(comment.post.toString()).toBe(this.post._id.toString());
    expect(comment.user.toString()).toBe(this.user._id.toString());
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
