const User = require("../../models/user.model");
const bcrypt = require("bcrypt");

describe("User Model", () => {
  const validUserData = {
    email: "test@example.com",
    password: "password123",
    name: "Test User",
  };

  test("should create a valid user", async () => {
    const user = await User.create(validUserData);
    expect(user.email).toBe(validUserData.email);
    expect(user.name).toBe(validUserData.name);
    expect(user.password).not.toBe(validUserData.password); // Password should be hashed
    expect(user.isAdmin).toBe(false); // Default value
  });

  test("should fail to create user without required fields", async () => {
    const invalidUser = new User({ email: "test@example.com" });
    let err;
    try {
      await invalidUser.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.password).toBeDefined();
    expect(err.errors.name).toBeDefined();
  });

  test("should fail to create user with duplicate email", async () => {
    await User.create(validUserData);
    const duplicateUser = new User(validUserData);
    let err;
    try {
      await duplicateUser.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.code).toBe(11000); // Duplicate key error
  });

  test("should hash password before saving", async () => {
    const user = await User.create(validUserData);
    const isMatch = await bcrypt.compare(validUserData.password, user.password);
    expect(isMatch).toBe(true);
  });
});
