// const { message } = require("antd");
const express = require("express");
const router = express.Router();
const tzNameRoute = require("./tzNameRoute");
// const tzCityRoute = require("./tzCityRoute");

router.get("/", (req, res) => {
  //
  res
    .status(200)
    .json({ success: true, message: `${req.method} - Request made` });
});

router.use("/tzNameRoute", tzNameRoute);
// router.use("/tzCityRoute", tzCityRoute);

module.exports = router;
