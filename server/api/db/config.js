const mongoose = require("mongoose");

const connectDB = async () => {
  // DEBUG: This will show what Render is actually seeing
  console.log("DEBUG: Connection URI is:", process.env.MONGODB_URI);
  //try catch if errors out
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB is successfully connected to ${conn.connection.host}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
