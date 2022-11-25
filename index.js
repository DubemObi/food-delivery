const mongoose = require("mongoose");
const express = require("express");
const fs = require("fs");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config({ path: "./config.env" });
const cookieParser = require("cookie-parser");
const authRoute = require("./src/routes/authRoute");
const userRoute = require("./src/routes/userRoute");
const menuRoute = require("./src/routes/menuRoutes");
const cartRoute = require("./src/routes/cartRoute");
const orderRoute = require("./src/routes/orderRoute");
const reviewRoutes = require("./src/routes/reviewRoute");

const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cors());

app.use(cookieParser());
app.use("/api/v1/auths", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/menus", menuRoute);
app.use("/api/v1/carts", cartRoute);
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/reviews", reviewRoutes);

mongoose.connect(process.env.mongoDB).then(() => {
  console.log("Connected to Database");
});
app.listen(PORT, () => {
  console.log("App is running on port " + PORT);
});
