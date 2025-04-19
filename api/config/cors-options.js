// CORS configuration
exports.corsOptions = {
  origin:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://newave.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
};
