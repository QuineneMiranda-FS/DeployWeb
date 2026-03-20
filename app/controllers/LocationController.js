const LocationModel = require("../models/LocationModel");
const { timeZones, locations } = require("../db/mockdata");

// GET All Locations
const getAllLocations = async (req, res, next) => {
  try {
    // try real db
    let dbLocations = await LocationModel.find({}).populate("timeZoneId");

    // use mockdata
    if (dbLocations.length === 0) {
      dbLocations = locations.map((loc) => ({
        ...loc,
        timeZoneId: timeZones.find((tz) => tz.id === loc.timeZoneId) || null,
      }));
    }
    res.status(200).json({
      success: true,
      count: dbLocations.length,
      data: dbLocations,
      metadata: { hostname: req.hostname, method: req.method },
    });
  } catch (error) {
    next(error);
  }
};

// GET Location by ID
const getLocationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const location = await LocationModel.findById(id).populate("timeZoneId");

    if (!location) {
      return res
        .status(404)
        .json({ success: false, message: `Location ID: ${id} not found.` });
    }

    res.status(200).json({
      success: true,
      data: location,
      metadata: { hostname: req.hostname, method: req.method },
    });
  } catch (error) {
    next(error);
  }
};

// POST (Create)
const createLocation = async (req, res, next) => {
  try {
    const { cityName, fullCityName, timeZoneId, postcode, region } = req.body;

    if (!cityName || !fullCityName) {
      return res.status(400).json({
        success: false,
        message: "cityName and fullCityName are required fields",
      });
    }

    const newRecord = await LocationModel.create({
      cityName,
      fullCityName,
      timeZoneId,
      postcode,
      region,
    });

    res.status(201).json({
      success: true,
      data: newRecord,
      message: "Location created successfully",
    });
  } catch (error) {
    next(error);
  }
};

// PUT (Update) by ID
const updateLocationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedLocation = await LocationModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true },
    ).populate("timeZoneId");

    if (!updatedLocation) {
      return res
        .status(404)
        .json({ success: false, message: `Location ID: ${id} not found.` });
    }

    res.status(200).json({ success: true, data: updatedLocation });
  } catch (error) {
    next(error);
  }
};

// DELETE by ID
const deleteLocationByID = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedRecord = await LocationModel.findByIdAndDelete(id);

    if (!deletedRecord) {
      return res
        .status(404)
        .json({ success: false, message: `Location ID: ${id} not found.` });
    }

    res.status(200).json({
      success: true,
      message: `Location ${id} deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocationById,
  deleteLocationByID,
};
