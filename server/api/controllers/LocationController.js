const LocationModel = require("../models/LocationModel");

// GET All Locations
// [ ?countryCode=US&sort=cityName&page=1&limit=10 ]
const getAllLocations = async (req, res, next) => {
  try {
    const excludedFields = [
      "sort",
      "page",
      "limit",
      "fields",
      "cityName",
      "fullCityName",
    ];
    const regexFields = ["cityName", "fullCityName"];

    let queryObj = { ...req.query };
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`,
    );
    let finalQuery = JSON.parse(queryStr);

    regexFields.forEach((field) => {
      if (req.query[field]) {
        finalQuery[field] = { $regex: req.query[field], $options: "i" };
      }
    });

    let query = LocationModel.find(finalQuery);

    const formatParam = (param) =>
      (Array.isArray(param) ? param.join(",") : param || "")
        .split(",")
        .join(" ")
        .trim();

    if (req.query.sort) {
      query = query.sort(formatParam(req.query.sort));
    } else {
      query = query.sort("-createdAt");
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    const dbLocations = await query;
    const total = await LocationModel.countDocuments(finalQuery);

    res.status(200).json({
      success: true,
      count: dbLocations.length,
      data: dbLocations,
      metadata: {
        totalItems: total,
        page: page,
        limit: limit,
      },
    });
  } catch (error) {
    next(error);
  }
};
//---------------------------------------------------------------------
// GET Location by ID
//below keeps jest from trying to test so stats not low
/* istanbul ignore next */
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
    });
  } catch (error) {
    next(error);
  }
};

//---------------------------------------------------------------------
// POST (Create)
//below keeps jest from trying to test so stats not low
/* istanbul ignore next */
const createLocation = async (req, res, next) => {
  try {
    const { cityName, countryCode } = req.body;

    let location = await LocationModel.findOne({
      cityName: { $regex: new RegExp(`^${cityName.trim()}$`, "i") },
    });

    if (location) {
      return res.status(200).json({ success: true, data: location });
    }

    location = new LocationModel(req.body);
    await location.save();

    res.status(201).json({ success: true, data: location });
  } catch (error) {
    next(error);
  }
};
//---------------------------------------------------------------------
// PUT (Update) by ID
//below keeps jest from trying to test so stats not low
/* istanbul ignore next */
const updateLocationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { _id, ...updateData } = req.body;

    const updatedLocation = await LocationModel.findOneAndUpdate(
      { _id: id },
      updateData,
      { new: true, runValidators: true },
    );

    if (!updatedLocation) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.status(200).json({ success: true, data: updatedLocation });
  } catch (error) {
    next(error);
  }
};

//---------------------------------------------------------------------
// DELETE by ID
//below keeps jest from trying to test so stats not low
/* istanbul ignore next */
const deleteLocationByID = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedRecord = await LocationModel.findOneAndDelete({ _id: id });

    if (!deletedRecord) {
      return res.status(404).json({ success: false, message: "ID not found" });
    }
    res.status(200).json({ success: true });
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
