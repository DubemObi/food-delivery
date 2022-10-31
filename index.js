const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const cookieParser = require("cookie-parser");
const authRoute = require("./src/routes/authRoute");
const userRoute = require("./src/routes/userRoute");
const menuRoute = require("./src/routes/menuRoutes");
const cartRoute = require("./src/routes/cartRoute");
const orderRoute = require("./src/routes/orderRoute");

const app = express();
const PORT = 3050;
app.use(express.json());

app.use(cookieParser());
app.use("/api/v1/auths", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/menus", menuRoute);
app.use("/api/v1/carts", cartRoute);
app.use("/api/v1/orders", orderRoute);

mongoose.connect(process.env.mongoDB).then(() => {
  console.log("Connected to Database");
});
app.listen(PORT, () => {
  console.log("App is running on port " + PORT);
});
