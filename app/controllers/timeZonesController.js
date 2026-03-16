const timeZonesModel = require("../models/timeZonesModel");
const tzNameModel = require("../models/timeZonesModel");

// GET All TZ Names
const getAllTimeZones = async (req, res) => {
  try {
    const timeZones = await timeZonesModel.find({});
    res.status(200).json({
      data: timeZone,
      success: true,
      message: `${req.method} - request to Timezone endpoint`,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET TZ Names by ID
const getTimeZonesById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const timeZone = timeZones.find((tz) => tz.id === id);
    //404 for errors
    if (!timeZone) {
      return res.status(404).json({ message: `Timezone ID: ${id} not found.` });
    }
    //200 for ok
    res.status(200).json({
      success: true,
      message: `GET by ID ${id} Successful to Timezone Name endpoint`,
      data: timeZone,
      metadata: { hostname: req.hostname, method: req.method },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PUT by ID
const updateTimezonesById = async (req, res) => {
  try {
    const { id } = req.params;
    const tzName = await tzNameModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      data: tzName,
      success: true,
      message: `${req.method} - request to Timezone Name endpoint`,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST
(req, res) => {
  const { name, city } = req.body.data;

  if (!name || !city) {
    return res.status(400).json({ message: "Name and City are required" });
  }
  //just having it automate an ID
  const newTimeZone = {
    id: Math.floor(1000 + Math.random() * 9000),
    name: name,
    city: city,
  };

  timeZones.push(newTimeZone);
  //201 ok created something
  res.status(201).json({
    message: `Added new timezone: ${name}`,
    data: newTimeZone,
  });
};
const createTimezones = async (req, res) => {
  try {
    const { timeZone } = req.body.data;
    if (!name || !city) {
      return res.status(400).json({ message: "Name and City are required" });
    }
    const newTimeZone = await timeZonesModel.create({ timeZone });

    res.status(201).json({
      success: true,
      data: newRecord,
      message: `${req.method} - request to Timezone Name endpoint`,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE by ID
const deleteTZNamesByID = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRecord = await tzNameModel.findByIdAndDelete(id);

    if (!deletedRecord) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }

    res.status(200).json({
      id,
      success: true,
      message: `${req.method} - Record deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createTZNames,
  getAllTZNames,
  getTZNamesById,
  updateTZNamesById,
  deleteTZNamesByID,
};

//fix catch errors by adding in next
