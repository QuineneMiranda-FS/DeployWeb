require("dotenv").config();
// const http = require("http"); //switched with express app
// const dotenv = ///don't nd
const app = require("./app/");
//database
const connectDB = require("./app/db/config");
connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is on ${PORT}`);
});
