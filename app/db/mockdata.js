const timeZones = [
  { id: 1111, name: "EST", fullName: "Eastern" },
  { id: 2222, name: "CST", fullName: "Central" },
  { id: 3333, name: "MST", fullName: "Mountain" },
  { id: 4444, name: "PST", fullName: "Pacific" },
];

const locations = [
  { id: 101, cityName: "New York", timeZoneId: 1111 },
  { id: 102, cityName: "Chicago", timeZoneId: 2222 },
  { id: 103, cityName: "Denver", timeZoneId: 3333 },
  { id: 104, cityName: "Los Angeles", timeZoneId: 4444 },
];
module.exports = { timeZones, locations };
