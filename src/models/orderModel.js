const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  cartId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: [true, "Cart is required"],
    },
  ],
  total: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Order", orderSchema);
