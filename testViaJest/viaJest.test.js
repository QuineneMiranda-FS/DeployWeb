const { uppercase, lowercase } = require("./viaJest");

describe("testing string", () => {
  //
  test("should uppercase a string input", () => {
    // long way://
    // const result = uppercase("bob");
    // expect(result).toBe("BOB");

    //can make abv one line:
    expect(uppercase("bob")).toBe("BOB");
  });
  test("should lowercase a string", () => {
    //
    expect(lowercase("FULL Sail")).toBe("full sail");
  });
});
