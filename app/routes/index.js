const express = require("express");
const router = express.Router();

//array storage

const timeZones = [
  { id: 1111, name: "Eastern", city: "New York" },
  { id: 2222, name: "Central", city: "Chicago" },
  { id: 3333, name: "Mountain", city: "Denver" },
  { id: 4444, name: "Pacific", city: "Los Angeles" },
];

// GET ALL
router.get("/", (req, res) => {
  res.status(200).json({
    message: "GET to API. This is the Timezones Route",
    data: timeZones,
    metadata: { hostname: req.hostname, method: req.method },
  });
});

// GET by ID
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const timeZone = timeZones.find((tz) => tz.id === id);
  //404 for errors
  if (!timeZone) {
    return res.status(404).json({ message: `Timezone ID: ${id} not found.` });
  }
  //200 for ok
  res.status(200).json({
    message: `GET by ID ${id} Successful`,
    data: timeZone,
    metadata: { hostname: req.hostname, method: req.method },
  });
});

// POST
router.post("/", (req, res) => {
  // console.log("Received body:", req.body);

  const { name, city } = req.body.data;

  if (!name || !city) {
    return res.status(400).json({ message: "Name and City are required" });
  }
  //just having it automate an ID
  const newTimeZone = {
    id: Math.floor(1000 + Math.random() * 9000),
    name: name,
    city: city,
  };

  timeZones.push(newTimeZone);
  //201 ok created something
  res.status(201).json({
    message: `Added new timezone: ${name}`,
    data: newTimeZone,
  });
});
//PUT (aka UPDATE) by ID
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const { name, city } = req.body.data;

  const index = timeZones.findIndex((tz) => tz.id === id);
  //404 error
  if (index === -1) {
    return res.status(404).json({ message: `Timezone ID: ${id} not found.` });
  }

  timeZones[index].name = name || timeZones[index].name;
  timeZones[index].city = city || timeZones[index].city;
  //200 ok
  res.status(200).json({
    message: `Updated timezone ID: ${id}`,
    data: timeZones[index],
    metadata: { hostname: req.hostname, method: req.method },
  });
});

// DELETE by ID
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = timeZones.findIndex((tz) => tz.id === id);
  //404 error
  if (index === -1) {
    return res.status(404).json({ message: `Timezone ID: ${id} not found.` });
  }

  const deletedTimeZone = timeZones.splice(index, 1);
  //200 ok
  res.status(200).json({
    message: `Deleted timezone ID: ${id}`,
    data: deletedTimeZone[0],
    metadata: { hostname: req.hostname, method: req.method },
  });
});

module.exports = router;
