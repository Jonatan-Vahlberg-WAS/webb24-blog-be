const Comment = require("../../models/comment.model");
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const UserFactory = require("./user.factory");
const PostFactory = require("./post.factory");

/**
 * Comment factory to generate test comment data using Faker
 */
class CommentFactory {
  /**
   * Generate fake comment data
   * @param {Object} overrides - Data to override defaults
   * @returns {Object} - Fake comment data
   */
  static generate(overrides = {}) {
    return {
      content: faker.lorem.paragraph(),
      post: overrides.post || new mongoose.Types.ObjectId(),
      user: overrides.user || new mongoose.Types.ObjectId(),
      ...overrides,
    };
  }

  /**
   * Create a comment with fake data
   * @param {Object} overrides - Data to override defaults
   * @returns {Promise<Comment>} - Created comment instance
   */
  static async create(overrides = {}) {
    // Create default user if not provided
    if (!overrides.user) {
      const user = await UserFactory.create();
      overrides.user = user._id;
    }

    // Create default post if not provided
    if (!overrides.post) {
      const post = await PostFactory.create();
      overrides.post = post._id;
    }

    const commentData = this.generate(overrides);
    return await Comment.create(commentData);
  }

  /**
   * Create multiple comments
   * @param {number} count - Number of comments to create
   * @param {Object} overrides - Base data to use for all comments
   * @returns {Promise<Array<Comment>>} - Array of created comments
   */
  static async createMany(count, overrides = {}) {
    const comments = [];
    for (let i = 0; i < count; i++) {
      comments.push(await this.create(overrides));
    }
    return comments;
  }

  /**
   * Build a comment instance without saving to database
   * @param {Object} overrides - Data to override defaults
   * @returns {Comment} - Comment instance
   */
  static build(overrides = {}) {
    const commentData = this.generate(overrides);
    return new Comment(commentData);
  }
}

module.exports = CommentFactory;
