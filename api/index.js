require("dotenv/config");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const { handler } = require("./routes");
const { connectDB } = require("./config/db");
const { errorHandler, AppError } = require("./middlewares/errorHandler");
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Routes
app.get("/", (req, res) => res.send("Hello from Express on Vercel"));
handler(app);
// Handle unhandled routes
app.use((req, res, next) => {
  const error = new AppError(
    `Can't find ${req.originalUrl} on this server!`,
    404
  );
  next(error);
});
// Global error handling middleware (add this after all routes)
app.use(errorHandler);
// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Started ${process.env.NODE_ENV}`);
});
