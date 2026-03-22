const { getGeoDataAPI } = require("../controllers/GeoDataController");
const GeoData = require("../models/GeoDataModel");

jest.mock("../models/GeoDataModel");

describe("GeoData API Enhanced Tests", () => {
  let req, res, mockQuery;

  beforeEach(() => {
    res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    // mock query
    mockQuery = {
      select: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([]),
    };
    GeoData.find.mockReturnValue(mockQuery);
  });

  test("should test 'select' field limitation", async () => {
    req = { query: { city: "London", select: "city,postcode" } };
    await getGeoDataAPI(req, res);
    expect(mockQuery.select).toHaveBeenCalledWith("city postcode");
  });

  test("should test pagination (skip and limit)", async () => {
    req = { query: { city: "London", skip: "5", limit: "2" } };
    await getGeoDataAPI(req, res);
    expect(mockQuery.skip).toHaveBeenCalledWith(5);
    expect(mockQuery.limit).toHaveBeenCalledWith(2);
  });

  test("should test sorting in both directions", async () => {
    // ascend (default)
    req = { query: { city: "London", sort: "city", order: "asc" } };
    await getGeoDataAPI(req, res);
    expect(mockQuery.sort).toHaveBeenCalledWith({ city: 1 });

    // descend
    req.query.order = "desc";
    await getGeoDataAPI(req, res);
    expect(mockQuery.sort).toHaveBeenCalledWith({ city: -1 });
  });
});
