const express = require("express");
const Menu = require("../models/menuModel");
const User = require("../models/userModel");
const { handleErrors } = require("../utils/menuErrors");

exports.createMenu = async (request, response) => {
  try {
    const { foodName, description, price, image } = request.body;
    const newMenu = new Menu({ foodName, description, price, image });
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
  findMenu.foodName = request.body.foodName;
  findMenu.description = request.body.description;
  findMenu.price = request.body.price;
  await findMenu.save();
  return response.status(200).send({
    status: true,
    message: "Menu has been updated successfully",
    data: findMenu,
  });
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

exports.getAllMenu = async (request, response) => {
  const findAllMenu = await Menu.find();
  return response.status(200).send({
    status: true,
    message: "All menus",
    data: findAllMenu,
  });
};

exports.deleteMenu = async (request, response) => {
  const { id } = request.query;
  const findMenu = await Menu.findByIdAndDelete(id);
  if (findMenu) {
    return response.status(200).send({
      status: true,
      message: "Menu deleted successfully",
    });
  } else {
    return response.status(409).send({
      status: false,
      message: "Menu not found",
    });
  }
};
