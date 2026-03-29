const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
// Import the routes
const routeHandler = require("./routes");
app.use(cors()); //***CORS (must be before routes)
//body parser
app.use(express.json());
//flag http calls
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Woo Hoo! Service is up and running!",
    success: true,
  });
});

app.use("/api", routeHandler);

// 404 Handler
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// Global Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      status: err.status || 500,
    },
  });
});

module.exports = app;
