// const express = require("express");
// const router = express.Router();
//short for abv
const router = require("express").Router();
//controller below
const {
  createTimeZone,
  getAllTimeZones,
  getTimeZoneById,
  updateTimeZoneById,
  deleteTimeZoneByID,
} = require("../controllers/timeZonesController");

//GET all Timezones
router.get("/", getAllTimeZones);

//GET by ID
router.get("/:id", getTimeZoneById);

//PUT by ID
router.put("/:id", updateTimeZoneById);

//POST
router.post("/", createTimeZone);

//DELETE by ID
router.delete("/:id", deleteTimeZoneByID);

module.exports = router;
