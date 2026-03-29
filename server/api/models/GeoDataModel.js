const mongoose = require("mongoose");

const geoSchema = new mongoose.Schema(
  {
    city: String,
    countryCode: String,
    postcode: String,
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true }, // lat and long
    },
    timezone: {
      name: String,
      name_alt: String,
      abbreviation_STD: String,
      abbreviation_DST: String,
      offset_STD: String,
      offset_DST: String,
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "lastUpdated" },
  },
);

// ***nd so mongo understands as a point on Earth instead of just numbers***
geoSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("GeoData", geoSchema);
