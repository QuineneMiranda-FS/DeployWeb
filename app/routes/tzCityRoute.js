// const express = require("express");
// const router = express.Router();
//short for abv
const router = require("express").Router();
//controller below
const {
  createTZCities,
  getAllTZCities,
  getTZCitiesById,
  updateTZCitiesById,
  deleteTZCitiesByID,
} = require("../controllers/tzCityController");

//GET all by TZ City
router.get("/", getAllTZCities);

//GET by ID
router.get("/:id", getTZCitiesById);

//PUT by ID
router.put("/:id", updateTZCitiesById);

//POST
router.post("/", createTZCities);

//DELETE by ID
router.delete("/:id", deleteTZCitiesByID);

module.exports = router;
