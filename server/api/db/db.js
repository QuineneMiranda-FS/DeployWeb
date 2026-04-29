const User = require("../models/user");

const saveUser = async (userData) => {
  const user = new User(userData);
  return await user.save(); // Triggers bcrypt hook
};
//maybe chg to findOne(object)
const findUser = async (object) => {
  return await User.find(object).exec();
};

module.exports = { saveUser, findUser };
