const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
const routeHandler = require("./routes");

const corsOptions = {
  // Replace with your new frontend's production URL (no trailing slash)
  origin: process.env.FRONTEND_URL || "https://vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
// Handle preflight requests for all routes
app.options("*", cors(corsOptions));
//body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
