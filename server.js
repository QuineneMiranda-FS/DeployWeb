const http = require("http");
require("dotenv").config();

const todos = [
  {
    id: 1,
    task: "Task One",
  },
  {
    id: 2,
    task: "Task Two",
  },
  {
    id: 3,
    task: "Task Three",
  },
];
// const app = require("./app/app");

// http.createServer(app).listen(process.env.PORT, () => {
//   console.log("server is running on port", process.env.PORT);
// });

const server = http.createServer((req, res) => {
  // const { headers, url, method } = req;
  // console.log(Headers, url, method);
  // res.setHeader("Content-Type", "text/plain");
  // res.write("<h1>Hello World</h1>"); //html not respected as html

  // res.setHeader("Content-Type", "text/html"); //shows as html
  // res.write("<h1>Hello World</h1>");
  // res.write("<p>This is a Node demo</p>");

  res.setHeader("Content-Type", "application/json"); //renders json

  res.end(
    JSON.stringify({
      success: true,
      method: req.method,
      data: todos,
    }),
  );
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
