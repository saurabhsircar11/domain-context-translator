require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const translateRoute = require("./routes/translate");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const projectRoutes = require("./routes/projects");

const cors = require("cors");

const app = express();
const port = 3000;

const connectDB = require("./config/db");
const passport = require("passport");
require("./config/passport");
connectDB();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3006",
    credentials: true,
  })
);
app.use(passport.initialize());
app.use("/api/auth", authRoutes);
app.use("/api/translate", translateRoute);
app.use("/api/user", userRoutes);
app.use("/api/projects", projectRoutes);

app.listen(port, () => {
  console.log(`Worker Started, PID:${process.pid}`);
  console.log({ environment: "dev" });
  console.log(`Server is running on port ${port}`);
  console.log(`Server running at http://localhost:${port}`);
});
