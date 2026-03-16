// const express = require("express");
// const router = express.Router();
//short for abv
const router = require("express").Router();
//controller below
const {
  createTZNames,
  getAllTZNames,
  getTZNamesById,
  updateTZNamesById,
  deleteTZNamesByID,
} = require("../controllers/tzNameController");

//GET all by TZ Name
router.get("/", getAllTZNames);

//GET by ID
router.get("/:id", getTZNamesById);

//PUT by ID
router.put("/:id", updateTZNamesById);

//POST
router.post("/", createTZNames);

//DELETE by ID
router.delete("/:id", deleteTZNamesByID);

module.exports = router;
