const Post = require("../../models/post.model");
const UserFactory = require("../factories/user.factory");
const CategoryFactory = require("../factories/category.factory");

describe("Post Model", () => {
  beforeEach(async function () {
    const user = await UserFactory.create();
    const category1 = await CategoryFactory.create();
    const category2 = await CategoryFactory.create();
    this.user = user;
    this.validPostData = {
      title: "Test Post",
      content: "This is a test post content that is long enough",
      categories: [category1._id, category2._id],
      user: this.user._id,
    };
  });

  test("should create a valid post", async function () {
    const post = await Post.create(this.validPostData);
    expect(post.title).toBe(this.validPostData.title);
    expect(post.content).toBe(this.validPostData.content);
    expect(post.categories).toEqual(
      expect.arrayContaining(this.validPostData.categories)
    );
    expect(post.user.toString()).toBe(this.validPostData.user.toString());
    expect(post.createdAt).toBeDefined();
  });

  test("should fail to create post with short title", async function () {
    const invalidPost = new Post({
      ...this.validPostData,
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

  test("should fail to create post with short content", async function () {
    const invalidPost = new Post({
      ...this.validPostData,
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

  test("should generate correct summary for long content", async function () {
    const post = new Post({
      ...this.validPostData,
      content:
        "This is a very long content that should be truncated in the summary",
    });
    expect(post.summery.length).toBeLessThan(post.content.length);
  });
});
