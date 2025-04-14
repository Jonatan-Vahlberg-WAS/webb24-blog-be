const User = require("../../models/user.model");
const { faker } = require("@faker-js/faker");

/**
 * User factory to generate test user data using Faker
 */
class UserFactory {
  /**
   * Generate fake user data
   * @param {Object} overrides - Data to override defaults
   * @returns {Object} - Fake user data
   */
  static generate(overrides = {}) {
    return {
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12 }),
      name: faker.person.fullName(),
      isAdmin: false,
      ...overrides,
    };
  }

  /**
   * Create a user with fake data
   * @param {Object} overrides - Data to override defaults
   * @returns {Promise<User>} - Created user instance
   */
  static async create(overrides = {}) {
    const userData = this.generate(overrides);
    return await User.create(userData);
  }

  /**
   * Create multiple users
   * @param {number} count - Number of users to create
   * @param {Object} overrides - Base data to use for all users
   * @returns {Promise<Array<User>>} - Array of created users
   */
  static async createMany(count, overrides = {}) {
    const users = [];
    for (let i = 0; i < count; i++) {
      users.push(await this.create(overrides));
    }
    return users;
  }

  /**
   * Build a user instance without saving to database
   * @param {Object} overrides - Data to override defaults
   * @returns {User} - User instance
   */
  static build(overrides = {}) {
    const userData = this.generate(overrides);
    return new User(userData);
  }

  /**
   * Create an admin user
   * @param {Object} overrides - Data to override defaults
   * @returns {Promise<User>} - Created admin user
   */
  static async createAdmin(overrides = {}) {
    return await this.create({ ...overrides, isAdmin: true });
  }
}

module.exports = UserFactory;
