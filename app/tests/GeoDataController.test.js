const { getGeoDataAPI } = require("../controllers/GeoDataController");
const GeoData = require("../models/GeoDataModel");

// mock model
jest.mock("../models/GeoDataModel");

describe("getGeoDataAPI Controller - Database Queries", () => {
  let req, res;

  beforeEach(() => {
    //reset mocks
    jest.clearAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  //mongoose mock chain
  const setupMongooseChain = (returnedData) => {
    const mockQuery = {
      select: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnValue(Promise.resolve(returnedData)),
    };
    GeoData.find.mockReturnValue(mockQuery);
    return mockQuery;
  };
  //select
  test("should apply 'select' and return limited data based on query", async () => {
    req = {
      query: { city: "London", select: "city,countryCode" },
    };
    const mockData = [{ city: "london", countryCode: "gb" }];
    const mockQuery = setupMongooseChain(mockData);

    await getGeoDataAPI(req, res);

    expect(mockQuery.select).toHaveBeenCalledWith("city countryCode");
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ count: 1, data: mockData }),
    );
  });

  //paginate
  test("should handle pagination using skip and limit", async () => {
    req = {
      query: { city: "London", skip: "5", limit: "2" },
    };
    const mockData = [{ city: "london" }, { city: "london" }];
    const mockQuery = setupMongooseChain(mockData);

    await getGeoDataAPI(req, res);

    expect(mockQuery.skip).toHaveBeenCalledWith(5);
    expect(mockQuery.limit).toHaveBeenCalledWith(2);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ source: "database" }),
    );
  });
  //sort
  test("should sort in ascending order (default)", async () => {
    req = {
      query: { city: "London", sort: "city", order: "asc" },
    };
    const mockQuery = setupMongooseChain([{ city: "london" }]);

    await getGeoDataAPI(req, res);

    expect(mockQuery.sort).toHaveBeenCalledWith({ city: 1 });
  });

  test("should sort in descending order", async () => {
    req = {
      query: { city: "London", sort: "city", order: "desc" },
    };
    const mockQuery = setupMongooseChain([{ city: "london" }]);

    await getGeoDataAPI(req, res);

    expect(mockQuery.sort).toHaveBeenCalledWith({ city: -1 });
  });
});
