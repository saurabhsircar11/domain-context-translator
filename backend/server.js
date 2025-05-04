const express = require("express");
const bodyParser = require("body-parser");
const translateRoute = require("./routes/translate");

const cors = require("cors");

const app = express();
const port = 3000;
require("dotenv").config();
const connectDB = require("./config/db");
const passport = require("passport");

connectDB();

app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());

app.use("/auth", require("./routes/auth"));
app.use("/translate", translateRoute);

app.listen(port, () => {
  console.log(`Worker Started, PID:${process.pid}`);
  console.log({ environment: "dev" });
  console.log(`Server is running on port ${port}`);
  console.log(`Server running at http://localhost:${port}`);
});
