const timeZones = [
  { id: "tz_1111", name: "EST", fullName: "Eastern" },
  { id: "tz_2222", name: "CST", fullName: "Central" },
  { id: "tz_3333", name: "MST", fullName: "Mountain" },
  { id: "tz_4444", name: "PST", fullName: "Pacific" },
];

const locations = [
  { id: "loc_101", cityName: "New York", timeZoneId: "tz_1111" },
  { id: "loc_102", cityName: "Chicago", timeZoneId: "tz_2222" },
  { id: "loc_103", cityName: "Denver", timeZoneId: "tz_3333" },
  { id: "loc_104", cityName: "Los Angeles", timeZoneId: "tz_4444" },
];
module.exports = { timeZones, locations };
