const { getGeoDataAPI } = require("../controllers/GeoDataController");
const GeoData = require("../models/GeoDataModel");
const mongoose = require("mongoose");
const axios = require("axios");

// swap btwn mock and no mock... to mock: npm test // no mock: USE_REAL_DB=true npm test
const isMocking = process.env.USE_REAL_DB !== "true";

if (isMocking) {
  jest.mock("../models/GeoDataModel");
  jest.mock("axios");
} else {
  // db
  beforeAll(async () => {
    const url =
      process.env.MONGO_URI_TEST || "mongodb://localhost:27017/test_db";
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(url);
    }

    // fake data
    await GeoData.deleteMany({});
    await GeoData.create({
      city: "london",
      countryCode: "gb",
      location: {
        type: "Point",
        coordinates: [-0.1278, 51.5074],
      },
    });
  });

  afterAll(async () => {
    await GeoData.deleteMany({}); // clear
    await mongoose.connection.close();
  });
}

describe("GeoData Controller - getGeoDataAPI", () => {
  let req, res, mockQuery;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    if (isMocking) {
      jest.clearAllMocks();
      axios.get = jest.fn().mockResolvedValue({ data: { results: [] } });

      mockQuery = {
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        then: jest.fn((resolve) => resolve([])),
      };
      GeoData.find = jest.fn().mockReturnValue(mockQuery);
    }
  });
  //query select
  // ?city=London&select=city,countryCode
  test("should correctly select city, country code", async () => {
    req = { query: { city: "London", select: "city,countryCode" } };
    const mockData = [{ city: "london", countryCode: "gb" }];

    if (isMocking) {
      mockQuery.then = jest.fn((resolve) => resolve(mockData));
    }

    await getGeoDataAPI(req, res);

    if (isMocking) {
      expect(mockQuery.select).toHaveBeenCalledWith("city countryCode");
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ count: 1, data: mockData }),
      );
    } else {
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ source: "database" }),
      );
    }
  });
  //paginate
  test("should handle pagination using skip and limit", async () => {
    req = { query: { city: "London", skip: "0", limit: "2" } };
    if (isMocking) {
      mockQuery.then = jest.fn((resolve) => resolve([{ city: "london" }]));
    }

    await getGeoDataAPI(req, res);

    if (isMocking) {
      expect(mockQuery.skip).toHaveBeenCalledWith(0);
      expect(mockQuery.limit).toHaveBeenCalledWith(2);
    }
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ source: "database" }),
    );
  });
  //sort ascend
  test("should sort in ascending order (default)", async () => {
    req = { query: { city: "London", sort: "city", order: "asc" } };
    if (isMocking) {
      mockQuery.then = jest.fn((resolve) => resolve([{ city: "london" }]));
    }

    await getGeoDataAPI(req, res);

    if (isMocking) {
      expect(mockQuery.sort).toHaveBeenCalledWith({ city: 1 });
    }
    expect(res.json).toHaveBeenCalled();
  });
  //sort descend
  test("should sort in descending order", async () => {
    req = { query: { city: "London", sort: "city", order: "desc" } };
    if (isMocking) {
      mockQuery.then = jest.fn((resolve) => resolve([{ city: "london" }]));
    }

    await getGeoDataAPI(req, res);

    if (isMocking) {
      expect(mockQuery.sort).toHaveBeenCalledWith({ city: -1 });
    }
    expect(res.json).toHaveBeenCalled();
  });
});
