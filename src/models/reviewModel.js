const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
    },

    review: {
      type: String,
      required: true,
    },
    orderHistory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderHistory",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
