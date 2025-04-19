const { User } = require("../schema/User");
const { AppError } = require("../middlewares/errorHandler");
const { fn } = require("../utils/utils");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  blacklistToken,
} = require("../utils/jwt.utils");

exports.register = fn(async (req, res, next) => {
  const { username, email, password } = req.body;
  const existingUser = await User.findOne({ username, email });
  if (existingUser) {
    return next(new AppError("User already exists", 400));
  }
  const user = await User.create({
    username,
    email,
    password,
  });
  await user.save();
  res.status(201).json({
    status: "success",
    message: "User created successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
});

exports.login = fn(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }
  const token = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  user.refreshToken = refreshToken;
  user.active = true;
  user.isOnline = "online";
  user.last_login = new Date();
  await user.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  res.status(200).json({
    status: "success",
    message: "Logged in successfully",
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
});

exports.logout = fn(async (req, res) => {
  const auth = req.headers.authorization;
  const token = auth && auth.split(" ")[1];

  if (token) {
    blacklistToken(token);
  }

  res.cookie("refreshToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});

exports.refreshToken = fn(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new AppError("No refresh token", 401);
  }

  const decoded = verifyRefreshToken(refreshToken);
  const user = await User.findById(decoded.id);

  if (!user || user.refreshToken !== refreshToken) {
    throw new AppError("Invalid refresh token", 401);
  }

  const accessToken = signAccessToken(user);

  res.status(200).json({
    status: "success",
    accessToken,
  });
});

exports.getMe = fn(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("username email");
  if (!user) {
    throw new AppError("User not found", 404);
  }
  res.status(200).json({
    status: "success",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
});
