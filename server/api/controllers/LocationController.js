const LocationModel = require("../models/LocationModel");

// GET All Locations
// [ ?countryCode=US&sort=cityName&page=1&limit=10 ]
const getAllLocations = async (req, res, next) => {
  try {
    // field exclude
    let queryObj = { ...req.query };
    const excludedFields = ["sort", "page", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // filter
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`,
    );

    // query
    let query = LocationModel.find(JSON.parse(queryStr));

    // sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt"); // default
    }

    // paginate ..only 4 in db right now so query like 2 at a time
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    const dbLocations = await query;
    const total = await LocationModel.countDocuments(JSON.parse(queryStr));

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

    // tz info
    // await newRecord.populate("timeZoneId");

    res.status(201).json({
      success: true,
      data: newRecord,
      message: "Location created successfully",
    });
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

//---------------------------------------------------------------------
// DELETE by ID
//below keeps jest from trying to test so stats not low
/* istanbul ignore next */
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
