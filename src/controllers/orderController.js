const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const User = require("../models/userModel");

exports.getOrder = async (request, response) => {
  try {
    const orderID = request.params.id;
    const user = request.user;
    const findOrder = await Order.findById(orderID);
    if (findOrder && findOrder.user.toString() === user.id.toString()) {
      response.status(200).json({
        status: "success",
        message: "Order found",
        data: findOrder,
      });
    } else {
      response.status(401).json({ message: "Unauthorized user" });
    }
  } catch (err) {
    console.log(err);
    response.status(400).json({ message: "Incomplete requirements" });
  }
};

exports.getAllOrders = async (request, response) => {
  try {
    const findOrder = await Order.find();
    if (findOrder) {
      response.status(200).json({
        status: success,
        message: "Orders found",
        data: findOrder,
      });
    } else {
      response.status(401).json({ message: "No order found" });
    }
  } catch (err) {
    response.status(400).json({ message: "Incomplete requirements" });
  }
};
