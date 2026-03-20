const timeZonesModel = require("../models/TimeZonesModel");
const { timeZones, locations } = require("../db/mockdata");

const getAllTimeZones = async (req, res, next) => {
  try {
    // from Mongo
    const mongoTimeZones = await timeZonesModel.find().populate("location");
    //in parens of find() abv add queries
    //example: await timeZonesModel.find({ name: "EST" })
    //?? do i need to add in the force capitalize
    // console.log(">>>", req.query);

    let queryString = JSON.stringify(req.query);

    //use select sort for this kind of data

    console.log(JSON.parse(queryString));
    // mock data
    const mockDataToSend = timeZones.map((tz) => ({
      ...tz,
      location: locations.find((loc) => loc.timeZoneId === tz.id) || null,
    }));

    // both mongo and mock
    const combinedData = [...mockDataToSend, ...mongoTimeZones];

    res.status(200).json({
      success: true,
      count: combinedData.length,
      data: combinedData,
      metadata: { hostname: req.hostname, method: req.method },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// if mongo doesn't have
const getTimeZoneById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // check db
    let timeZone = await timeZonesModel.findById(id).populate("location");

    // check mock
    if (!timeZone) {
      const mockTz = timeZones.find((tz) => tz.id === id || tz._id === id);
      if (mockTz) {
        timeZone = {
          ...mockTz,
          location:
            locations.find((loc) => loc.timeZoneId === mockTz.id) || null,
        };
      }
    }

    if (!timeZone) {
      return res.status(404).json({ message: `Timezone ID: ${id} not found.` });
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
