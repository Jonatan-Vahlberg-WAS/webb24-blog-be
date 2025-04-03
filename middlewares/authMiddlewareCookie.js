const { verifyAccessToken } = require("../utils/jwt");
const User = require("../models/user.model");

async function authMiddleware(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new Error("No token found in cookies");
    }

    const decodedToken = verifyAccessToken(token);
    if (!decodedToken) {
      throw new Error("Invalid token");
    }

    // Optionally verify user still exists in DB
    const user = await User.findById(decodedToken.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Attach user info to request
    req.user = user;
    req.userId = decodedToken.userId;

    next();
  } catch (error) {
    console.warn("Error: authorizing endpoint", error);
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
}

module.exports = authMiddleware;
