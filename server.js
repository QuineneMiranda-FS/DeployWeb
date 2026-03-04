const http = require("http");
require("dotenv").config();

http.createServer.listen(process.env.PORT, () => {
  console.log("server is running on port", process.env.PORT);
});

// const server = http.createServer((req, res) => {
//   const { headers, url, method } = req;
//   console.log(Headers, url, method);
//   res.setHeader("Content-Type", "text/plain");
//   res.write("<h1>Hello World</h1>");
//   res.end();
// });

// const PORT = 3000;

// server.listen(PORT, () => {
//   console.log(`listening on ${PORT}`);
// });
