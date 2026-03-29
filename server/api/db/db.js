const User = require("../models/user");

const saveUser = async (newUser) => {
  // sv to db
  return await newUser.save();
};

const findUser = async (object) => {
  return await User.find(object).exec();
};

module.exports = { saveUser, findUser };
