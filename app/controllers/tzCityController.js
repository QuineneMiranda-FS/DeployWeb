//**can replace const to exports if want to do that way **/

// GET All TZ Cities
const getAllTZCities = (req, res) => {
  res.status(200).json({
    success: true,
    message: `{req.method} - request to Timezone City endpoint`,
  });
};

//GET TZ Cities by ID
const getTZCitiesById = (req, res) => {
  //
  const { id } = req.params;
  res.status(200).json({
    id,
    success: true,
    message: `{req.method} - request to Timezone City endpoint`,
  });
};

//PUT by ID
const updateTZCitiesById = (req, res) => {
  //
  const { id } = req.params;
  res.status(200).json({
    id,
    success: true,
    message: `{req.method} - request to Timezone City endpoint`,
  });
};

//POST
const createTZCities = (req, res) => {
  //
  res.status(200).json({
    success: true,
    message: `{req.method} - request to Timezone Name endpoint`,
  });
};

//DELETE by ID
const deleteTZCitiesByID = (req, res) => {
  //
  const { id } = req.params;
  res.status(200).json({
    id,
    success: true,
    message: `{req.method} - request to Timezone City endpoint`,
  });
};

module.exports = {
  createTZCities,
  getAllTZCities,
  getTZCitiesById,
  updateTZCitiesById,
  deleteTZCitiesByID,
};
