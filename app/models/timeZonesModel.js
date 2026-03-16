const mongoose = require("mongoose");

const tzNameSchema = new mongoose.Schema(
  {
    // properties of TZ names
    name: {
      type: String,
      //[value, error msg]
      required: [true, "Timezone must have a name"],
      unique: true,
      trim: true, //takes space away fm before and after
      minLength: [3, "Name needs to be at least 3 characters"],
      maxLength: [5, "Name CANNOT be more than 5 characters"], //most are 3-4
    },
    fullName: {
      type: String,
      required: [true, "Timezone must have a name"],
      unique: true,
      trim: true, //takes space away fm before and after
      minLength: [3, "Name needs to be at least 3 characters"],
      maxLength: [168, "Name CANNOT be more than 168 characters"], //longest named city is 168 characters
    },
  },
  { timestamps: true }, //adds to mongo
);

module.exports = mongoose.model("tzName", tzNameSchema);

//rules:
// type specifies the data type of the field (e.g., String, Number).
// required ensures that the field is mandatory.
// minLength and maxLength define the length constraints for strings.
// unique ensures that the value for the field is unique across documents.
// match enforces a regular expression pattern for string validation.
// min and max set minimum and maximum numerical values.

//**look into more REGEX for stuff like match **
//**look more into enum ie for array list for string types */
