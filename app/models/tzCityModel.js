const mongoose = require("mongoose");

const tzCitySchema = new mongoose.Schema({
  // properties of TZ Cities
  city: {
    type: String,
    //[value, error msg]
    required: [true, "Timezone must have a default city assigned"]
    trim: true, //takes space away fm before and after
    minLength: [3, "Name needs to be at least 3 characters"], 
    maxLength: [50, "Name CANNOT exceed 50 characters"], //most are 3-4
  },
  //refer to name model for name of timezone
  name: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tzNameModel",
  }
}
{timestamps: true} //adds to mongo 
);

module.exports = mongoose.model("tzName", tzCitySchema);

//rules:
// type specifies the data type of the field (e.g., String, Number).
// required ensures that the field is mandatory.
// minLength and maxLength define the length constraints for strings.
// unique ensures that the value for the field is unique across documents.
// match enforces a regular expression pattern for string validation.
// min and max set minimum and maximum numerical values.

//**look into more REGEX for stuff like match **
//**look more into enum ie for array list for string types */
