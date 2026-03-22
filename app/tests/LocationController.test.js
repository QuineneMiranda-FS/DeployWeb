const { getAllLocations } = require("../controllers/LocationController");
const LocationModel = require("../models/LocationModel");

// mock
jest.mock("../models/LocationModel");

describe("Location Controller - getAllLocations", () => {
  let req, res, next, mockQuery;

  beforeEach(() => {
    // mock query
    mockQuery = {
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      then: jest.fn(), // ** nd add for the await
    };

    LocationModel.find.mockReturnValue(mockQuery);
    LocationModel.countDocuments = jest.fn().mockResolvedValue(10);

    req = { query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  // query string
  test("should filter results based on countryCode", async () => {
    req.query = { countryCode: "US" };
    mockQuery.then = jest.fn((resolve) => resolve([{ cityName: "NY" }]));

    await getAllLocations(req, res, next);

    expect(LocationModel.find).toHaveBeenCalledWith({ countryCode: "US" });
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ count: 1 }),
    );
  });

  // paginate
  test("should calculate correct skip and limit for pagination", async () => {
    req.query = { page: "2", limit: "5" };
    mockQuery.then = jest.fn((resolve) => resolve([]));

    await getAllLocations(req, res, next);

    expect(mockQuery.skip).toHaveBeenCalledWith(5);
    expect(mockQuery.limit).toHaveBeenCalledWith(5);
  });

  // sort
  //ascend
  test("should sort in ascending order", async () => {
    req.query = { sort: "cityName" };
    mockQuery.then = jest.fn((resolve) => resolve([]));

    await getAllLocations(req, res, next);

    expect(mockQuery.sort).toHaveBeenCalledWith("cityName");
  });
  //descend
  test("should sort in descending order", async () => {
    req.query = { sort: "-cityName" };
    mockQuery.then = jest.fn((resolve) => resolve([]));

    await getAllLocations(req, res, next);

    expect(mockQuery.sort).toHaveBeenCalledWith("-cityName");
  });
});
