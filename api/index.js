require("dotenv/config");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const { handler } = require("./routes");
const { connectDB } = require("./config/db");
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
// Routes
app.get("/", (req, res) => res.send("Hello from Express on Vercel"));
handler(app);

// Connect to MongoDB
connectDB();
 
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Started ${process.env.NODE_ENV}`);
});
