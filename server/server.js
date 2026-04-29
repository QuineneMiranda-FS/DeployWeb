require("dotenv").config();
// const http = require("http"); //switched with express app
// const dotenv = ///don't nd

//db
//// '0.0.0.0' for  Render
connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is on ${PORT}`);
  });
});

const app = require("./api");

const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`Server is on ${PORT}`);
// });

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is on ${PORT}`);
});
