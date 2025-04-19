const { connect, connection } = require("mongoose");

exports.connectDB = async () => {
  try {
    await connect(
      String(process.env.MONGODB_URI).replace(
        "<PASSWORD>",
        String(process.env.DB_PASSWORD)
      )
    );

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
