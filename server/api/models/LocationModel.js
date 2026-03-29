const mongoose = require("mongoose");
const Counter = require("./CounterModel");

const LocationSchema = new mongoose.Schema(
  {
    _id: { type: String },
    cityName: {
      type: String,
      required: [true, "City is required"],
      unique: true,
      trim: true,
      minLength: [3, "City name must be at least 3 characters"],
      maxLength: [50, "City name cannot exceed 50 characters"],
      match: [/^[a-zA-Z\s\-']+$/, "Please provide a valid city name"],
    },
    fullCityName: {
      type: String,
    },
    countryCode: {
      type: String,
      required: [true, "Country code is required"],
      uppercase: true,
      trim: true,
      minLength: [2, "Country code must be 2 characters"],
      maxLength: [2, "Country code must be 2 characters"],
      match: [/^[A-Z]{2}$/, "Please provide a valid 2-letter ISO country code"],
    },
    timeZoneId: {
      type: String,
      ref: "TimeZone",
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
LocationSchema.pre("save", async function () {
  if (!this.isNew || (this._id && this._id.startsWith("loc_"))) return;

  try {
    if (this.isNew) {
      const counter = await Counter.findByIdAndUpdate(
        { _id: "location_id" },
        { $inc: { seq: 1 } },
        { returnDocument: "after", upsert: true },
      );
      this._id = `loc_${100 + counter.seq}`;
    }
  } catch (error) {
    console.error("Counter Error:", error);
    throw error;
  }
});
module.exports = mongoose.model("Location", LocationSchema);
