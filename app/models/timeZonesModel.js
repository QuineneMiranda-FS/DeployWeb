const mongoose = require("mongoose");

const timeZoneSchema = new mongoose.Schema(
  {
    // abbreviation
    name: {
      type: String,
      required: [true, "Abbreviated name is required"],
      trim: true, //takes space away fm before and after
      uppercase: true, // make sure abbreviation all uppercase
      minLength: [3, "Name needs to be at least 3 characters"],
      maxLength: [6, "Name CANNOT be more than 6 characters"], //most are 3-4
    },

    // The Full Name of TimeZone aka IANA
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      unique: true,
      trim: true,
      minLength: [3, "Name needs to be at least 3 characters"],
      maxLength: [38, "Name CANNOT be more than 38 characters"], //longest named city is 168 characters but std db sets 38 max
    },
    // **Debating... want to actually pull the time from library dynamically**
    // time: {
    //   type: String,
    //   // required: [true, "Local time is required"],
    //   match: [/^\d{2}:\d{2}$/, "Time must be in HH:MM format"],
    // },
    //**FIX/CHECK not sure on this cuz hello regex... ugh
    offset: {
      type: String,
      // required: true,
      match: [/^[+-]\d{2}:\d{2}$/, "Offset must be in +/-HH:MM format"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("TimeZone", timeZoneSchema);

//**look into more REGEX need to make sure doing it right **
//**look more into enum --- might want an enum for zones **/
