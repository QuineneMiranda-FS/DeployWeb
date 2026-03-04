const express = require("express");
const app = express();
const router = require("./routes");

app.use(express.json()); //must be before middleware/routes

app.get("/", (req, res) => {
  console.log("GET");
  res.json({ message: "Hello World!" });
});

//middleware
app.use("/api", router);

module.exports = app;
