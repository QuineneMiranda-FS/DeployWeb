const mongoose = require("mongoose");
const geoSchema = new mongoose.Schema({
  city: String,
  timezone: String,
  lastUpdated: Date,
});
module.exports = mongoose.model("GeoData", geoSchema);
