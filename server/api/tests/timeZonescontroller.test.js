const { getAllTimeZones } = require("../controllers/TimeZonesController");
const timeZonesModel = require("../models/TimeZonesModel");
const mongoose = require("mongoose");

// swap btwn mock and no mock... to mock: npm test // no mock: USE_REAL_DB=true npm test
const isMocking = process.env.USE_REAL_DB !== "true";

if (isMocking) {
  jest.mock("../models/TimeZonesModel");
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

describe("TimeZones Controller - getAllTimeZones", () => {
  let req, res, next, mockQuery;

  beforeEach(() => {
    req = { query: {}, hostname: "localhost", method: "GET" };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();

    // mock query
    if (isMocking) {
      jest.clearAllMocks();
      mockQuery = {
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue([]),
      };
      timeZonesModel.find = jest.fn().mockReturnValue(mockQuery);
    }
  });

  // query string select
  test("should filter by query string and select specific fields", async () => {
    req.query = { name: "EST", select: "name,offset" };
    const mockData = [{ name: "EST", offset: -5 }];

    if (isMocking) {
      mockQuery.populate = jest.fn().mockResolvedValue(mockData);
    }

    await getAllTimeZones(req, res, next);

    if (isMocking) {
      expect(timeZonesModel.find).toHaveBeenCalledWith(
        expect.objectContaining({
          name: { $regex: "EST", $options: "i" },
        }),
      );
      expect(mockQuery.select).toHaveBeenCalledWith("name offset");
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ data: mockData }),
      );
    }
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // paginate - skip limit
  test("should calculate correct skip and limit for pagination", async () => {
    req.query = { page: "2", limit: "5" };

    await getAllTimeZones(req, res, next);

    if (isMocking) {
      expect(mockQuery.skip).toHaveBeenCalledWith(5);
      expect(mockQuery.limit).toHaveBeenCalledWith(5);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ page: 2 }),
      );
    }
  });

  // Sorting
  test("should sort in both directions", async () => {
    // ascend
    req.query.sort = "name";
    await getAllTimeZones(req, res, next);
    if (isMocking) expect(mockQuery.sort).toHaveBeenLastCalledWith("name");

    // descend
    req.query.sort = "-name";
    await getAllTimeZones(req, res, next);
    if (isMocking) expect(mockQuery.sort).toHaveBeenLastCalledWith("-name");

    expect(res.status).toHaveBeenCalledWith(200);
  });
});
