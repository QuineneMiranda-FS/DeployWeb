const app {timeZonesController.js, LocationController.js} = require(./timeZonesController);
jest.mock("./timeZonesController");
//jest
// describe("", () => {
//   //
// });
describe("TimeZones Tests", async () => {
  //
  Test('Should return blah blah blah', () => {
    //
    const result = await xxx();
    expect(result.data).toEqual(1); 
  });
});