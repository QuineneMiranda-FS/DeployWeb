require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./api");
const connectDB = require("./api/db/config");

mongoose.set("debug", true);

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is successfully running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB:", err.message);
    process.exit(1);
  });
