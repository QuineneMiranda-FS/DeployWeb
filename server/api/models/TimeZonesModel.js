const mongoose = require("mongoose");
const Counter = require("./CounterModel");

const timeZoneSchema = new mongoose.Schema(
  {
    _id: { type: String },
    name: {
      type: String,
      required: [true, "Abbreviated name is required"],
      trim: true,
      uppercase: true,
      minLength: [3, "Name needs to be at least 3 characters"],
      maxLength: [6, "Name CANNOT be more than 6 characters"],
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minLength: [3, "Name needs to be at least 3 characters"],
      maxLength: [38, "Name CANNOT be more than 38 characters"],
    },
    location: {
      type: String,
      // ref: "Location",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  },
);
timeZoneSchema.virtual("locationData", {
  ref: "Location",
  localField: "_id",
  foreignField: "timeZoneId",
  justOne: true,
});

// Auto for _id
timeZoneSchema.pre("save", async function () {
  try {
    if (this.isNew) {
      const counter = await Counter.findByIdAndUpdate(
        { _id: "timezone_id" },
        { $inc: { seq: 1 } },
        { returnDocument: "after", upsert: true },
      );

      this._id = `tz_${1110 + counter.seq}`;
    }
  } catch (error) {
    console.error("Counter Error:", error);
    throw error;
  }
});

module.exports = mongoose.model("TimeZone", timeZoneSchema);
