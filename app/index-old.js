const express = require("express");
const morgan = require("morgan");
const app = express();
const router = require("./routes"); //aka routehandler

//db
const connectDB = require("../app/db/config");
connectDB();

app.use(express.json()); //must be before middleware/routes ... this attaches way to access

// **Assignment: Your localhost:3000 should show your actuator message: "Service is up"
//below is actuator msg
app.get("/", (req, res) => {
  console.log("GET");
  res.json({ message: "Woo Hoo! Service is up and running!" });
});

//middleware
app.use("/api/", router);
//rest of routes

//underneath routes add in more middleware for errors
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
