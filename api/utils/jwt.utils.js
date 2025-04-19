const jwt = require("jsonwebtoken");
const { AppError } = require("../middlewares/errorHandler");

// Token blacklist (in-memory store for demonstration)
const tokenBlacklist = new Set();

// Sign access token with enhanced payload and error handling
const signAccessToken = (user) => {
  try {
    return jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
  } catch (error) {
    throw new AppError("Error generating access token", 500);
  }
};

// Sign refresh token with enhanced security
const signRefreshToken = (user) => {
  try {
    return jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );
  } catch (error) {
    throw new AppError("Error generating refresh token", 500);
  }
};

// Verify access token with enhanced error handling
const verifyAccessToken = (token) => {
  try {
    if (tokenBlacklist.has(token)) {
      throw new AppError("Token has been revoked", 401);
    }
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    // Let the centralized error handler in errorHandler.js handle JWT errors
    throw error;
  }
};

// Verify refresh token with enhanced security
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    // Let the centralized error handler in errorHandler.js handle JWT errors
    throw error;
  }
};

// Add token to blacklist
const blacklistToken = (token) => {
  tokenBlacklist.add(token);
};

// Clear expired tokens from blacklist (should be called periodically)
const clearBlacklist = () => {
  tokenBlacklist.clear();
};

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  blacklistToken,
  clearBlacklist,
};
