const mongoose = require("mongoose");

const newSchema = new mongoose.Schema({
  //
  name: String,
});

module.exports = mongoose.model("xx", newSchema);
