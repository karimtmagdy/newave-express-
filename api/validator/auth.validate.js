const { z } = require("zod");
const validate = require("../middlewares/validate");

const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be less than 30 characters")
      .trim(),
    email: z.string().email("Invalid email format").toLowerCase().trim(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(50, "Password must be less than 50 characters"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

const loginSchema = z.object({
  email: z.string().email("Invalid email format").toLowerCase().trim(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must be less than 50 characters"),
});

const refreshTokenSchema = z.object({
  refreshToken: z
    .string({
      required_error: "Refresh token is required",
    })
    .min(1, "Refresh token cannot be empty"),
});

module.exports = {
  validateRegister: validate(registerSchema),
  validateLogin: validate(loginSchema),
  validateRefreshToken: validate(refreshTokenSchema),
};
