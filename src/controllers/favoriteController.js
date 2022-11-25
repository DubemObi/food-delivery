const Favorite = require("../models/favoriteModel");
const User = require("../models/userModel");
const Menu = require("../models/menuModel");

exports.addToFavorite = async (request, response) => {
  try {
    const reqBody = request.body;
    const userID = request.user;
    const favorite = new Favorite(reqBody);
    if (userID.id !== reqBody.user) {
      response.status(401).json({ message: "Unauthorized user" });
    } else {
      await favorite.save();

      response.status(201).json({
        status: true,
        mesaage: "Added to Favorite successfully",
        data: favorite,
      });
    }
  } catch (err) {
    response.status(400).json({ mesaage: "Incomplete requirements" });
  }
};

exports.getFavorite = async (request, response) => {
  try {
    const userID = request.user;
    const reqBody = request.body;
    if (userID.id !== reqBody.user) {
      response.status(401).json({ message: "Unauthorized user" });
    } else {
      const findAllFavorite = await Favorite.find({ user: reqBody.user });

      if (findAllFavorite) {
        response.status(200).json({
          status: true,
          message: "Favorites found",
          quantity: findAllFavorite.length,
          data: findAllFavorite,
        });
      } else {
        response
          .status(200)
          .json({ status: failed, message: "No Favorite found" });
      }
    }
  } catch (err) {
    response.status(400).json({ mesaage: "Incomplete requirements" });
  }
};

exports.deleteFavorite = async (request, response) => {
  try {
    const favoriteID = request.params.id;
    const reqBody = request.body;
    const findFavorite = await Favorite.findById(favoriteID);
    const FavoriteUser = await User.findById(findFavorite.user);
    if (findFavorite && FavoriteUser.id === reqBody.user) {
      const FavoriteDelete = await Favorite.findByIdAndDelete(favoriteID);

      response.status(200).json({
        status: true,
        message: "Favorite deleted successfully",
        data: FavoriteDelete,
      });
    } else {
      response.status(401).json({ message: "Unauthorized user" });
    }
  } catch (err) {
    response.status(400).json({ message: "Incomplete requirements" });
  }
};
