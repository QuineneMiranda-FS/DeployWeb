const timeZonesModel = require("../models/TimeZonesModel");

const getAllTimeZones = async (req, res, next) => {
  try {
    const timeZones = await timeZonesModel.find().populate("location");

    res.status(200).json({
      success: true,
      count: timeZones.length,
      data: timeZones,
      metadata: {
        hostname: req.hostname,
        method: req.method,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getTimeZoneById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const timeZone = await timeZonesModel.findById(id).populate("location");

    if (!timeZone) {
      const error = new Error(`Timezone ID: ${id} not found.`);
      error.status = 404;
      return next(error);
    }

    res.status(200).json({ success: true, data: timeZone });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
// POST (Create)
const createTimezone = async (req, res, next) => {
  try {
    const { name, fullName, offset, location } = req.body;

    if (!name || !fullName) {
      return res
        .status(400)
        .json({ message: "Name and fullName are required" });
    }

    const newRecord = await timeZonesModel.create({
      name,
      fullName,
      offset,
      location,
    });

    await newRecord.populate("location");

    res.status(201).json({
      success: true,
      data: newRecord,
      message: "Timezone created successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PUT by ID
const updateTimezoneById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedTZ = await timeZonesModel
      .findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      })
      .populate("location");

    if (!updatedTZ) {
      return res
        .status(404)
        .json({ success: false, message: `Timezone ID: ${id} not found.` });
    }

    res.status(200).json({
      success: true,
      data: updatedTZ,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE by ID
const deleteTimezoneByID = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedRecord = await timeZonesModel.findByIdAndDelete(id);

    if (!deletedRecord) {
      return res
        .status(404)
        .json({ success: false, message: `Timezone ID: ${id} not found.` });
    }

    res.status(200).json({
      success: true,
      message: `ID ${id} deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getAllTimeZones,
  getTimeZoneById,
  createTimezone,
  updateTimezoneById,
  deleteTimezoneByID,
};
