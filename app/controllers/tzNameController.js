const tzNameModel = require("../models/tzNameModel");

// GET All TZ Names
const getAllTZNames = async (req, res) => {
  try {
    const tzNames = await tzNameModel.find({});
    res.status(200).json({
      data: tzNames,
      success: true,
      message: `${req.method} - request to Timezone Name endpoint`,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET TZ Names by ID
const getTZNamesById = async (req, res) => {
  try {
    const { id } = req.params;
    const tzName = await tzNameModel.findById(id);

    if (!tzName) {
      return res.status(404).json({ success: false, message: "Not Found" });
    }

    res.status(200).json({
      data: tzName,
      success: true,
      message: `${req.method} - request to Timezone Name endpoint`,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PUT by ID
const updateTZNamesById = async (req, res) => {
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
const createTZNames = async (req, res) => {
  try {
    const { tzName } = req.body;
    const newRecord = await tzNameModel.create({ tzName });

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
