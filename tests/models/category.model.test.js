const Category = require("../../models/category.model");

describe("Category Model", () => {

  beforeEach(async function () {
    this.validCategoryData = {
      name: "Test Category",
      slug: "test-category",
    };
  });

  test("should create a valid category", async function () {
    const category = await Category.create(this.validCategoryData);
    expect(category.name).toBe(this.validCategoryData.name);
    expect(category.slug).toBe(this.validCategoryData.slug);
  });

  test("should fail to create category without required fields", async function () {
    const invalidCategory = new Category({ name: "Test Category" });
    let err;
    try {
      await invalidCategory.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.slug).toBeDefined();
  });

  test("should fail to create category with duplicate name", async function () {
    await Category.create(this.validCategoryData);
    const duplicateCategory = new Category(this.validCategoryData);
    let err;
    try {
      await duplicateCategory.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.code).toBe(11000);
  });

  test("should fail to create category with duplicate slug", async function () {
    await Category.create(this.validCategoryData);
    const duplicateCategory = new Category({
      ...this.validCategoryData,
      name: "Test Category 2",
    });
    let err;
    try {
      await duplicateCategory.save();
    } catch (error) {
      err = error;
    }
  });
});
