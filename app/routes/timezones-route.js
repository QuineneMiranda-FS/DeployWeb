// const express = require("express");
// const router = express.Router();
//short for abv
const router = require("express").Router();
//controller below
const {
  createTimezone,
  getAllTimeZones,
  getTimeZoneById,
  updateTimezoneById,
  deleteTimezoneByID,
} = require("../controllers/timeZonesController");

//GET all Timezones
router.get("/", getAllTimeZones);

//GET by ID
router.get("/:id", getTimeZoneById);

//PUT by ID
router.put("/:id", updateTimezoneById);

//POST
router.post("/", createTimezone);

//DELETE by ID
router.delete("/:id", deleteTimezoneByID);

module.exports = router;
