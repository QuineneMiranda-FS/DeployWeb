const { getAllTimeZones } = require("../controllers/TimeZonesController");
const timeZonesModel = require("../models/TimeZonesModel");
//mock
jest.mock("../models/TimeZonesModel");

describe("getAllTimeZones Controller", () => {
  let req, res, next;
  //mock query
  beforeEach(() => {
    req = { query: {}, hostname: "localhost", method: "GET" };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  const mockQueryChain = (data) => {
    const query = {
      select: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      populate: jest.fn().mockResolvedValue(data),
    };
    timeZonesModel.find.mockReturnValue(query);
    return query;
  };

  // query string select
  it("should filter by query string and select specific fields", async () => {
    req.query = { name: "EST", select: "name,offset" };
    const mockData = [{ name: "EST", offset: -5 }];
    const query = mockQueryChain(mockData);

    await getAllTimeZones(req, res, next);

    // regex and case sensitivity
    expect(timeZonesModel.find).toHaveBeenCalledWith(
      expect.objectContaining({
        name: { $regex: "EST", $options: "i" },
      }),
    );
    // select
    expect(query.select).toHaveBeenCalledWith("name offset");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ data: mockData }),
    );
  });
  // paginate - skip limit
  it("should handle pagination (skip and limit)", async () => {
    req.query = { page: "2", limit: "5" };
    const mockData = [
      /* items 6-10 */
    ];
    const query = mockQueryChain(mockData);

    await getAllTimeZones(req, res, next);

    expect(query.skip).toHaveBeenCalledWith(5);
    expect(query.limit).toHaveBeenCalledWith(5);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ page: 2 }));
  });

  //Sorting
  it("should sort in both directions", async () => {
    const query = mockQueryChain([]);

    // ascend
    req.query.sort = "name";
    await getAllTimeZones(req, res, next);
    expect(query.sort).toHaveBeenLastCalledWith("name");

    // descend
    req.query.sort = "-name";
    await getAllTimeZones(req, res, next);
    expect(query.sort).toHaveBeenLastCalledWith("-name");
  });
});
