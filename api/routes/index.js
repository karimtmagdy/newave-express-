const authRoutes = require("./auth.routes");
exports.handler = async (event) => {
    event.use("/api/v1/auth", authRoutes);
}