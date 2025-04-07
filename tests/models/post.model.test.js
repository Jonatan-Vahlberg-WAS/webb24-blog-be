const Post = require("../../models/post.model");
const mongoose = require("mongoose");

describe("Post Model", () => {
  const validPostData = {
    title: "Test Post",
    content: "This is a test post content that is long enough",
    categories: [new mongoose.Types.ObjectId()],
    user: new mongoose.Types.ObjectId(),
  };

  test("should create a valid post", async () => {
    const post = await Post.create(validPostData);
    expect(post.title).toBe(validPostData.title);
    expect(post.content).toBe(validPostData.content);
    expect(post.categories).toEqual(
      expect.arrayContaining(validPostData.categories)
    );
    expect(post.user.toString()).toBe(validPostData.user.toString());
    expect(post.createdAt).toBeDefined();
  });

  test("should fail to create post with short title", async () => {
    const invalidPost = new Post({
      ...validPostData,
      title: "ab",
    });
    let err;
    try {
      await invalidPost.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.title).toBeDefined();
  });

  test("should fail to create post with short content", async () => {
    const invalidPost = new Post({
      ...validPostData,
      content: "short",
    });
    try {
      await invalidPost.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.content).toBeDefined();
  });

  test("should generate correct summary for long content", () => {
    const post = new Post({
      ...validPostData,
      content:
        "This is a very long content that should be truncated in the summary",
    });
    expect(post.summery.length).toBeLessThan(post.content.length);
  });
});
