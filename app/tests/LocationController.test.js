const { getAllLocations } = require("../controllers/LocationController");
const LocationModel = require("../models/LocationModel");
const mongoose = require("mongoose");
//swap btwn mock and no mock... to mock: npm test // no mock: USE_REAL_DB=true npm test
const isMocking = process.env.USE_REAL_DB !== "true";

if (isMocking) {
  jest.mock("../models/LocationModel");
} else {
  // no mock
  beforeAll(async () => {
    const url =
      process.env.MONGO_URI_TEST || "mongodb://localhost:27017/test_db";
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(url);
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
}

describe("Location Controller - getAllLocations", () => {
  let req, res, next, mockQuery;

  beforeEach(() => {
    req = { query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    //mock query
    if (isMocking) {
      mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        then: jest.fn((resolve) => Promise.resolve(resolve([]))),
      };

      LocationModel.find = jest.fn().mockReturnValue(mockQuery);
      LocationModel.countDocuments = jest.fn().mockResolvedValue(10);
    }
  });
  //query select
  test("should filter results based on countryCode", async () => {
    req.query = { countryCode: "US" };

    if (isMocking) {
      mockQuery.then = jest.fn((resolve) => resolve([{ cityName: "NY" }]));
    }

    await getAllLocations(req, res, next);

    if (isMocking) {
      expect(LocationModel.find).toHaveBeenCalledWith({ countryCode: "US" });
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ count: 1 }),
      );
    } else {
      expect(res.json).toHaveBeenCalled();
    }
  });
  //paginate
  test("should calculate correct skip and limit for pagination", async () => {
    req.query = { page: "2", limit: "5" };
    await getAllLocations(req, res, next);

    if (isMocking) {
      expect(mockQuery.skip).toHaveBeenCalledWith(5);
      expect(mockQuery.limit).toHaveBeenCalledWith(5);
    }
  });
  //sort ascend
  test("should sort in ascending order", async () => {
    req.query = { sort: "cityName" };
    await getAllLocations(req, res, next);

    if (isMocking) {
      expect(mockQuery.sort).toHaveBeenCalledWith("cityName");
    }
  });
  //sort descend
  test("should sort in descending order", async () => {
    req.query = { sort: "-cityName" };
    await getAllLocations(req, res, next);

    if (isMocking) {
      expect(mockQuery.sort).toHaveBeenCalledWith("-cityName");
    } else {
      expect(res.json).toHaveBeenCalled();
    }
  });
});
