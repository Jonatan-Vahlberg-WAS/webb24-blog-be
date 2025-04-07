const Category = require("../../models/category.model");

describe("Category Model", () => {
  const validCategoryData = {
    name: "Test Category",
    slug: "test-category",
  };

  test("should create a valid category", async () => {
    const category = await Category.create(validCategoryData);
    expect(category.name).toBe(validCategoryData.name);
    expect(category.slug).toBe(validCategoryData.slug);
  });

  test("should fail to create category without required fields", async () => {
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

  test("should fail to create category with duplicate name", async () => {
    await Category.create(validCategoryData);
    const duplicateCategory = new Category(validCategoryData);
    let err;
    try {
      await duplicateCategory.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.code).toBe(11000);
  });
});
