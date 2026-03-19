const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema(
  {
    cityName: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      minLength: [3, "City name must be at least 3 characters"],
      maxLength: [50, "City name cannot exceed 50 characters"],

      match: [/^[a-zA-Z\s\-']+$/, "Please provide a valid city name"],
    },
    fullCityName: {
      type: String,
    },
    timeZoneId: {
      // type: String,
      type: mongoose.Schema.Types.ObjectId,
      ref: "TimeZonesModel",
      // exactly,
      // required: true,
    },
    postcode: {
      type: String,
      trim: true,
      uppercase: true,
      minLength: [3, "Postcode is too short"],
      maxLength: [10, "Postcode is too long"],
    },
    region: {
      type: String,
      trim: true,
      minLength: [2, "Region must be at least 2 characters"],
      maxLength: [100, "Region cannot exceed 100 characters"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Location", LocationSchema);
