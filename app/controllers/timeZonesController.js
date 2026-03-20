const timeZonesModel = require("../models/TimeZonesModel");

const getAllTimeZones = async (req, res, next) => {
  try {
    // filtering
    const queryObj = { ...req.query };
    const excludedFields = ["select", "sort", "page", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // filter range (gt, gte, lt, lte, in)
    // Note: ?createdAt[gt]=2023-01-01 converted to { createdAt: { $gt: '2023-01-01' } }
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`,
    );

    let finalQuery = JSON.parse(queryStr);

    // partial matches
    if (req.query.name) {
      finalQuery.name = { $regex: req.query.name, $options: "i" };
    }
    if (req.query.fullName) {
      finalQuery.fullName = { $regex: req.query.fullName, $options: "i" };
    }

    // query
    let query = timeZonesModel.find(finalQuery);

    // field fix
    if (req.query.select) {
      //multiples
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }

    // sort
    const sortBy = req.query.sort || "name";
    query = query.sort(sortBy);

    // paginate
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    const timeZones = await query.populate("location");

    res.status(200).json({
      success: true,
      count: timeZones.length,
      page,
      data: timeZones,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

//old working code before query
// const getAllTimeZones = async (req, res, next) => {
//   try {
//     const timeZones = await timeZonesModel.find().populate("location");

//     res.status(200).json({
//       success: true,
//       count: timeZones.length,
//       data: timeZones,
//       metadata: {
//         hostname: req.hostname,
//         method: req.method,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

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
