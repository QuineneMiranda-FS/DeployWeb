const express = require("express");
const { saveUser, findUser } = require("../db/db");
const router = express.Router();
const User = require("../models/user");
const mongoose = require("mongoose");
const { successTemplate, errorTemplate } = require("../../templates/templates");

// GET User
router.get("/", (req, res, next) => {
  console.log("Getting Users");
  findUser({})
    .then((result) => {
      successTemplate(res, "User Retrieved", result);
    })
    .catch((err) => {
      errorTemplate(res, err.message, err.status);
    });
});

// POST - Add NEW User
router.post("/", (req, res) => {
  console.log("Saving User");
  const { firstName, lastName, email } = req.body;

  const newUser = new User({
    _id: new mongoose.Types.ObjectId(),
    firstName: firstName,
    lastName: lastName,
    email: email,
  });

  saveUser(newUser)
    .then((result) => {
      successTemplate(res, "User Saved", result);
    })
    .catch((err) => {
      errorTemplate(res, err.message, err.status);
    });
});

module.exports = router;
