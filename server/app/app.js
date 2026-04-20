const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");

const timeZoneRoutes = require("../api/routes/timezones-route");
const locationRoutes = require("../api/routes/location-route");
const geoDataRoutes = require("../api/routes/geo-route");
const userRoutes = require("../api/routes/users");

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Use CORS middleware
app.use(
  cors({
    // Replace with your actual Netlify URL
    origin: "https://wdv463.netlify.app/",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

//Router
app.use("/timeZones", timeZoneRoutes);
app.use("/location", locationRoutes);
app.use("/geoData", geoDataRoutes);
app.use("/users", userRoutes);

//Service -localhost
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Service is up",
    method: req.method,
  });
});

//Errors
//Middleware to handle errors and bad url path
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      message: error.message,
      status: error.status,
    },
  });
});

//connect to mongodb
mongoose.connect(process.env.MONGODB_URI);
module.exports = app;
