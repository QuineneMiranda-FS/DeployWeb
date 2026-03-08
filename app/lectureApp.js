const express = require("express");
const app = express();
const router = require("./routes");

app.use(express.json()); //must be before middleware/routes

//below is actuator msg
app.get("/", (req, res) => {
  console.log("GET");
  res.json({ message: "Service is up and running" });
});

//middleware
app.use("/api", router);
//rest of routes

//underneath routes add in more middleware for errors
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  //err = req
  //   console.log("ERROR >>>", err);
  res
    .status(err.status || 500)
    .json({ message: err.message, status: err.status });
});

module.exports = app;
