require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./app/db/config");
const { timeZones, locations } = require("./app/db/mockdata");
const TimeZone = require("./app/models/TimeZonesModel");
const Location = require("./app/models/LocationModel");

const seedData = async () => {
  try {
    await connectDB();

    // Clean out so no dups
    await TimeZone.deleteMany({});
    await Location.deleteMany({});

    // insert mockdata
    await TimeZone.insertMany(timeZones);
    await Location.insertMany(locations);

    console.log("Data Imported Successfully!");
    process.exit();
  } catch (error) {
    console.error("Error with data import:", error);
    process.exit(1);
  }
};

seedData();
