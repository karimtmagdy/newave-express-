const { connect, connection } = require("mongoose");

exports.connectDB = async () => {
  try {
    if (process.env.NODE_ENV === "development") {
      await connect(
        String(process.env.MONGO_URI).replace(
          "<PASSWORD>",
          String(process.env.DB_PASSWORD)
        )
      );
    } else await connect(String(process.env.MONGODB_URI));
    connection.on("connected", () => {
      console.log("Connected to MongoDB");
    });

    connection.on("error", (err) => {
      console.log("MongoDB connection error:", err);
    });

    connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });
  } catch (err) {
    console.log("MongoDB connection error:", err);
    process.exit(1);
  }
};
