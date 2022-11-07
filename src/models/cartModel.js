const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  foodMenu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Menu",
  },
  quantity: {
    type: Number,
    default: "1",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  subTotal: {
    type: Number,
    default: 0,
  },
  status: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Cart", CartSchema);
