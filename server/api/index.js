const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
const routeHandler = require("./routes");
const app = express();

app.set("etag", false);

// const corsOptions = {
//   origin: "*", // Allows any device (like your phone/emulator)
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true,
// };

// app.use(cors(corsOptions));
// Handle preflight requests for all routes
// app.options("/{*any}", cors(corsOptions));
app.use(cors());
//body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//middleware
app.use((req, res, next) => {
  res.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  );
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});

//flag http calls
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Woo Hoo! Service is up and running!",
    success: true,
  });
});

app.use("/api", routeHandler);

//Health Check Render
// app.get("/healthcheck", (req, res) => {
//   res.status(200).send("OK");
// });

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
