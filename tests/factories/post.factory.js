const Post = require("../../models/post.model");
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const UserFactory = require("./user.factory");
const CategoryFactory = require("./category.factory");

/**
 * Post factory to generate test post data using Faker
 */
class PostFactory {
  /**
   * Generate fake post data
   * @param {Object} overrides - Data to override defaults
   * @returns {Object} - Fake post data
   */
  static generate(overrides = {}) {
    return {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(3),
      categories: overrides.categories || [new mongoose.Types.ObjectId()],
      user: overrides.user || new mongoose.Types.ObjectId(),
      createdAt: faker.date.recent(),
      ...overrides,
    };
  }

  /**
   * Create a post with fake data
   * @param {Object} overrides - Data to override defaults
   * @returns {Promise<Post>} - Created post instance
   */
  static async create(overrides = {}) {
    // Create default user if not provided
    if (!overrides.user) {
      const user = await UserFactory.create();
      overrides.user = user._id;
    }

    // Create default categories if not provided
    if (!overrides.categories || overrides.categories.length === 0) {
      const category = await CategoryFactory.create();
      overrides.categories = [category._id];
    }

    const postData = this.generate(overrides);
    return await Post.create(postData);
  }

  /**
   * Create multiple posts
   * @param {number} count - Number of posts to create
   * @param {Object} overrides - Base data to use for all posts
   * @returns {Promise<Array<Post>>} - Array of created posts
   */
  static async createMany(count, overrides = {}) {
    const posts = [];
    for (let i = 0; i < count; i++) {
      posts.push(await this.create(overrides));
    }
    return posts;
  }

  /**
   * Build a post instance without saving to database
   * @param {Object} overrides - Data to override defaults
   * @returns {Post} - Post instance
   */
  static build(overrides = {}) {
    const postData = this.generate(overrides);
    return new Post(postData);
  }

  /**
   * Create a post with long content for testing summary
   * @param {Object} overrides - Data to override defaults
   * @returns {Promise<Post>} - Created post with long content
   */
  static async createWithLongContent(overrides = {}) {
    const longContent = faker.lorem.paragraphs(10);
    return await this.create({ ...overrides, content: longContent });
  }
}

module.exports = PostFactory;
