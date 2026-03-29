require("dotenv").config();
// const http = require("http"); //switched with express app
// const dotenv = ///don't nd

//db
const connectDB = require("./api/db/config");
connectDB();

const app = require("./api");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is on ${PORT}`);
});
