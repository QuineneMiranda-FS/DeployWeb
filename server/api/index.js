const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const routeHandler = require("./routes");

const app = express();

app.set("etag", false);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  );
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Service is up!", success: true });
});

app.use("/", routeHandler);

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
