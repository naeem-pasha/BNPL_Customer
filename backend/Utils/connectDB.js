const mongoose = require("mongoose");

let isConnected = false; // Track connection status

/**
 * Connect to MongoDB using Mongoose
 * @returns {Promise<void>}
 */
const connectToDatabase = async () => {
  if (isConnected) {
    console.log("Already connected to MongoDB");
    return;
  }

  try {
    const uri =
      process.env.MONGO_URI || "mongodb://localhost:27017/user-dashboard";

    // Connect to MongoDB
    const db = await mongoose.connect(uri);

    isConnected = db.connections[0].readyState === 1; // Check connection state
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process if the connection fails
  }
};

module.exports = connectToDatabase;
