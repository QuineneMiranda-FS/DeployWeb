const express = require("express");
const morgan = require("morgan");

const app = express();
// Import the routes
const routeHandler = require("./routes");
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

// Error handling middleware **must be underneath
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      status: err.status || 500,
    },
  });
});

module.exports = app;
