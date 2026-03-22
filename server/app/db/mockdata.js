const timeZones = [
  { id: "tz_1111", countryCode: "US", name: "EST", fullName: "Eastern" },
  { id: "tz_2222", countryCode: "US", name: "CST", fullName: "Central" },
  { id: "tz_3333", countryCode: "US", name: "MST", fullName: "Mountain" },
  { id: "tz_4444", countryCode: "US", name: "PST", fullName: "Pacific" },
];

const locations = [
  {
    id: "loc_101",
    countryCode: "US",
    cityName: "New York",
    timeZoneId: "tz_1111",
  },
  {
    id: "loc_102",
    countryCode: "US",
    cityName: "Chicago",
    timeZoneId: "tz_2222",
  },
  {
    id: "loc_103",
    countryCode: "US",
    cityName: "Denver",
    timeZoneId: "tz_3333",
  },
  {
    id: "loc_104",
    countryCode: "US",
    cityName: "Los Angeles",
    timeZoneId: "tz_4444",
  },
];
module.exports = { timeZones, locations };
