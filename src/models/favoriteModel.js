const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  foodMenu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Menu",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Favorite", favoriteSchema);
