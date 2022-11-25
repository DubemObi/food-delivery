const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  foodName: {
    type: String,
    required: [true, "Please enter the food name"],
    unique: true,
  },
  description: {
    type: String,
    required: [true, "Please enter a category"],
  },
  price: {
    type: Number,
    required: [true, "Enter the price"],
  },
  image: {
    type: String,
    required: [true, "Add image URL"],
  },
  cloudinary_id: {
    type: String,
  },
  category: {
    type: String,
    required: [true, "Please enter category"],
  },
});

const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;
