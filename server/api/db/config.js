const mongoose = require("mongoose");

const connectDB = async () => {
  // This will print all keys Render has injected
  console.log("Available Env Keys:", Object.keys(process.env));

  if (!process.env.MONGO_URI) {
    throw new Error("CRITICAL: MONGO_URI is missing from process.env");
  }
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB is successfully connected to ${conn.connection.host}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
