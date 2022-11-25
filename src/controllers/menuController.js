const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const Menu = require("../models/menuModel");
const User = require("../models/userModel");
const { handleErrors } = require("../utils/menuErrors");
const cloudinary = require("../utils/cloudinary");
const QueryMethod = require("../utils/query");

const multerStorage = multer.diskStorage({});

const upload = multer({ storage: multerStorage });

exports.uploadImage = upload.single("image");

exports.resizeImage = async (req, res, next) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      width: 500,
      height: 500,
      crop: "fill",
    });

    const imageName = result.url;
    req.body.image = imageName;
    req.body.cloudinary_id = result.public_id;
    next();
  } catch (err) {
    res.send('An error occured')
  }
};

exports.createMenu = async (request, response) => {
  try {
    const { foodName, description, price, image, cloudinary_id, category } =
      request.body;
    const newMenu = new Menu({
      foodName,
      description,
      price,
      image,
      cloudinary_id,
      category,
    });
    await newMenu.save();
    return response.status(201).send({
      status: true,
      message: "Menu has been created",
      data: newMenu,
    });
  } catch (err) {
    const error = handleErrors(err);
    return response.status(400).json({ error });
  }
};

exports.updateMenu = async (request, response) => {
  const id = request.params.id;
  const findMenu = await Menu.findById(id);
  if (findMenu) {
    // cloudinary.uploader
    //   .destroy(findMenu.cloudinary_id)
    //   .then((result) => console.log(result));
    findMenu.foodName = request.body.foodName;
    findMenu.description = request.body.description;
    findMenu.price = request.body.price;
    await findMenu.save();
    return response.status(200).send({
      status: true,
      message: "Menu has been updated successfully",
      data: findMenu,
    });
  } else {
    response.status(409).send({
      status: false,
      message: "Menu not found",
    });
  }
};

exports.getOneMenu = async (request, response) => {
  try {
    const id = request.params.id;
    const findOneMenu = await Menu.findById(id);

    if (!findOneMenu) {
      return response.status(404).send({
        status: false,
        message: "Menu not found",
      });
    } else {
      return response.status(200).send({
        status: true,
        message: "Menu found",
        Blog: findOneMenu,
      });
    }
  } catch (err) {
    if (err.path === "_id") {
      return response.status(401).send({
        status: false,
        message: "Invalid ID",
      });
    } else {
      return response.status(500).send({
        status: false,
        message: "Server Error",
      });
    }
  }
};

exports.getAllMenu = async (req, res) => {
  try {
    let queriedMenu = new QueryMethod(Menu.find(), req.query)
      .sort()
      .filter()
      .limit()
      .paginate();
    let menu = await queriedMenu.query;
    res.status(200).json({
      status: "success",
      results: menu.length,
      data: menu,
    });
  } catch (err) {
    const error = handleErrors(err);
    return response.status(400).json({ error });
  }
};

exports.deleteMenu = async (request, response) => {
  const { id } = request.query;
  const findMenu = await Menu.findByIdAndDelete(id);
  if (findMenu) {
    cloudinary.uploader.destroy(findMenu.cloudinary_id).then(() => {
      return response.status(200).send({
        status: true,
        message: "Menu deleted successfully",
      });
    });
  } else {
    return response.status(409).send({
      status: false,
      message: "Menu not found",
    });
  }
};
