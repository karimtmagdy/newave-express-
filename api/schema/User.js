const { Schema, model, Types } = require("mongoose");
const { hash, compare } = require("bcryptjs");
const slugify = require("slugify");

const GENDER_TYPES = Object.freeze({
  MALE: "male",
  FEMALE: "female",
});
const USER_ROLES = Object.freeze({
  USER: "user",
  ADMIN: "admin",
  MANAGER: "manager",
  MODERATOR: "moderator",
});
const USER_STATUS = Object.freeze({
  ACTIVE: "active",
  INACTIVE: "inactive",
  BANNED: "banned",
  SUSPENDED: "suspended",
});
const ONLINE_STATUS = Object.freeze({
  ONLINE: "online",
  OFFLINE: "offline",
});

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    refreshToken: String,
    slug: { type: String, lowercase: true, trim: true },
    active: { type: Boolean, default: false },
    phone: { type: Number, default: undefined, sparse: true },
    remember_me: { type: Boolean, default: false, sparse: true },
    verified: { type: Boolean, default: false },
    photo: {
      type: String,
      default: undefined,
      sparse: true,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER,
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.ACTIVE,
    },
    isOnline: {
      type: String,
      enum: Object.values(ONLINE_STATUS),
      default: ONLINE_STATUS.OFFLINE,
    },
    gender: {
      type: String,
      enum: Object.values(GENDER_TYPES),
      sparse: true,
    },
    age: {
      type: Number,
      sparse: true,
    },
    last_login: {
      type: Date,
      select: false,
      sparse: true,
    },
    cart: [{ type: Types.ObjectId, ref: "cart", sparse: true }],
    orders: [{ type: Types.ObjectId, ref: "order", sparse: true }],
  },
  { timestamps: { createdAt: "joinedAt" }, collection: "users" }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await compare(candidatePassword, this.password);
};
userSchema.pre("save", function (next) {
  this.slug = slugify(this.username, { lower: true });
  next();
});
const User = model("User", userSchema);
module.exports = { User };
