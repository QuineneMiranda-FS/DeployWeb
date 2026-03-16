//**can replace const to exports if want to do that way **/

// GET All TZ Names
const getAllTZNames = (req, res) => {
  res.status(200).json({
    success: true,
    message: `{req.method} - request to Timezone Name endpoint`,
  });
};

//GET TZ Names by ID
const getTZNamesById = (req, res) => {
  //
  const { id } = req.params;
  res.status(200).json({
    id,
    success: true,
    message: `{req.method} - request to Timezone Name endpoint`,
  });
};

//PUT by ID
const updateTZNamesById = (req, res) => {
  //
  const { id } = req.params;
  res.status(200).json({
    id,
    success: true,
    message: `{req.method} - request to Timezone Name endpoint`,
  });
};

//POST
const createTZNames = (req, res) => {
  //
  res.status(200).json({
    success: true,
    message: `{req.method} - request to Timezone Name endpoint`,
  });
};

//DELETE by ID
const deleteTZNamesByID = (req, res) => {
  //
  const { id } = req.params;
  res.status(200).json({
    id,
    success: true,
    message: `{req.method} - request to Timezone Name endpoint`,
  });
};

module.exports = {
  createTZNames,
  getAllTZNames,
  getTZNamesById,
  updateTZNamesById,
  deleteTZNamesByID,
};
