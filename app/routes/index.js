const express = require("express");
const router = express.Router();

// const todos = []; for assignment

router.get("/", (req, res) => {
  req.status(200).json;
  ({
    message: "GET to API",
    metadata: { hostname: req.hostname, method: req.method },
  });
});

router.post("/", (req, res) => {
  // console.log(req.body);
  const { data } = req.body;
  res.status(200).json({
    message: "POST to /api",
    metadata: { hostname: req.hostname, method: req.method },
  });
});

// `localhost:3000/api/`;
// router.get("/", (req, res) => {
//   res.status(200).json({ message: "From the API" });
// });

// `localhost:3000/api/:id`;
// router.delete("/:id", (req, res) => {
//   const id = req.params.id;
//   const todo = arr.find((obj) => obj.id === id);
//   console.log("params >>>", id);
//   res.status(200).json({ message: "from the API" });
// });

// router.get("/:city", (req, res) => {
//   const city = req.params.city;
//   console.log("params >>>", city);
//   res.status(200).json({ message: "From the API" });
// });

// router.post("/", (req, res) => {
//   // console.log("Request body >>>", req.body);
//   const { data } = req.body;
//   res.status(200).json({
//     message: "Post to /api",
//     data: data, //if want can write as just data as key and value are same
//     metadata: { hostname: req.hostname, method: req.method },
//   });
// });

//Assignment: GET by ID - http://localhost:3000/{your context name}/45
//goes to anything following.. ie at the * localhost:3000/api/*
router.get("/:id", (req, res) => {
  const { id } = req.params;
  console.log(id);
  res.status(200).json({
    message: "Get by id for /api",
    metadata: { hostname: req.hostname, method: req.method },
  });
});

//Assignment: PATCH or PUT by ID - http://localhost:3000/{your context name}/89
router.put("/:id", (req, res) => {
  const { id } = req.params;
  //whatever need to do here
  console.log(id);
});

//Assignment: DELETE by ID - http://localhost:3000/{your context name}/9
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  //whatever need to do here
  console.log(id);
});

// Assignment: GET - http://localhost:3000/{your context name}
//Assignment:POST - http://localhost:3000/{your context name}
module.exports = router;
