const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "From the API" });
});

router.get("/", (req, res) => {});

router.post("/", (req, res) => {
  console.log("Request body >>>", req.body);
  const { data } = req.body;
  res.status(200).json({ message: "We got the request", data: data });
});

module.exports = router;
