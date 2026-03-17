const timeZonesModel = require("../models/TimeZonesModel");

const { timeZones: mockTimeZones } = require("../db/mockdata");

const getAllTimeZones = async (req, res, next) => {
  try {
    const dbData = await timeZonesModel.find({});

    const dataToSend = dbData.length > 0 ? dbData : mockTimeZones;

    //200 = ok
    res.status(200).json({
      success: true,
      data: dataToSend,
      message: `${req.method} - request successful`,
      metadata: { hostname: req.hostname, method: req.method },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET TimeZone by ID
const getTimeZoneById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const timeZone = await timeZonesModel.findById(id);

    if (!timeZone) {
      return res.status(404).json({ message: `Timezone ID: ${id} not found.` });
    }

    res.status(200).json({
      success: true,
      data: timeZone,
      metadata: { hostname: req.hostname, method: req.method },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST (Create)
const createTimezone = async (req, res, next) => {
  try {
    const { name, fullName, offset } = req.body;

    if (!name || !fullName) {
      return res
        .status(400)
        .json({ message: "Name and fullName are required" });
    }

    // Change for Mongo Generates ID automatically
    //just having it automate an ID
    // const newTimeZone = {
    //   id: Math.floor(1000 + Math.random() * 9000),
    //   name: name,
    //   city: city,
    // };
    const newRecord = await timeZonesModel.create({
      name,
      fullName,
      offset,
    });

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

    const updatedTZ = await timeZonesModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTZ) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
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
        .json({ success: false, message: "Record not found" });
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
