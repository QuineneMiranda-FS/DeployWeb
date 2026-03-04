const express = require("express");
const router = express.Router();

// const todos = []; for assignment

`localhost:3000/api/`;
router.get("/", (req, res) => {
  res.status(200).json({ message: "From the API" });
});

`localhost:3000/api/:id`;
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const todo = arr.find((obj) => obj.id === id);
  console.log("params >>>", id);
  res.status(200).json({ message: "from the API" });
});

router.get("/:city", (req, res) => {
  const city = req.params.city;
  console.log("params >>>", city);
  res.status(200).json({ message: "From the API" });
});

router.get("/", (req, res) => {});

router.post("/", (req, res) => {
  console.log("Request body >>>", req.body);
  const { data } = req.body;
  res.status(200).json({ message: "We got the request", data: data });
});

module.exports = router;
