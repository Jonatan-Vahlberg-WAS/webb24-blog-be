const Category = require("../../models/category.model");
const { faker } = require("@faker-js/faker");

/**
 * Category factory to generate test category data using Faker
 */
class CategoryFactory {
  /**
   * Generate fake category data
   * @param {Object} overrides - Data to override defaults
   * @returns {Object} - Fake category data
   */
  static generate(overrides = {}) {
    const name = `Category ${Math.random()} - ${faker.commerce.department()}`;
    return {
      name,
      slug: faker.helpers.slugify(name).toLowerCase(),
      ...overrides,
    };
  }

  /**
   * Create a category with fake data
   * @param {Object} overrides - Data to override defaults
   * @returns {Promise<Category>} - Created category instance
   */
  static async create(overrides = {}) {
    const categoryData = this.generate(overrides);
    return await Category.create(categoryData);
  }

  /**
   * Create multiple categories
   * @param {number} count - Number of categories to create
   * @param {Object} overrides - Base data to use for all categories
   * @returns {Promise<Array<Category>>} - Array of created categories
   */
  static async createMany(count, overrides = {}) {
    const categories = [];
    for (let i = 0; i < count; i++) {
      categories.push(await this.create(overrides));
    }
    return categories;
  }

  /**
   * Build a category instance without saving to database
   * @param {Object} overrides - Data to override defaults
   * @returns {Category} - Category instance
   */
  static build(overrides = {}) {
    const categoryData = this.generate(overrides);
    return new Category(categoryData);
  }
}

module.exports = CategoryFactory;
