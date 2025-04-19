const { User } = require("../schema/User");
const { verifyAccessToken } = require("../utils/jwt.utils");
const { AppError } = require("./errorHandler");
const { fn } = require("../utils/utils");

// JWT Authentication middleware
exports.protect = fn(async (req, res, next) => {
  const auth = req.headers.authorization;
  const token = auth && auth.split(" ")[1];

  if (!token) {
    throw new AppError("You are not logged in", 401);
  }

  const decoded = verifyAccessToken(token);
  const user = await User.findById(decoded.id).select("+role +active");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  req.user = decoded;
  next();
});

// Admin role verification middleware
exports.isAdmin = fn(async (req, res, next) => {
  await exports.protect(req, res, () => {});
  
  const allowedRoles = ["admin", "manager", "moderator"];
  if (!allowedRoles.includes(req.user.role)) {
    throw new AppError("Access denied. Admin only.", 403);
  }
  next();
});

// Private route middleware
exports.privateRoute = fn(async (req, res, next) => {
  await exports.protect(req, res, () => {});
  
  const user = await User.findById(req.user.id).select("+active");
  if (!user) {
    throw new AppError("User not found", 404);
  }
  
  req.user = {
    ...req.user,
    active: user.active,
  };
  next();
});

// Protected route middleware
exports.protectedRoute = fn(async (req, res, next) => {
  await exports.privateRoute(req, res, () => {});
  
  if (!req.user.active) {
    throw new AppError("Your account is not active", 403);
  }
  next();
});
