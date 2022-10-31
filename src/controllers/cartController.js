const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const Menu = require("../models/menuModel");
const Order = require("../models/orderModel");

const sumAllCart = (array) => {
  let number = array;
  let total = 0;
  for (let i = 0; i < number.length; i++) {
    total = total + number[i].subTotal;
  }
  return total;
};

exports.addToCart = async (request, response) => {
  try {
    const reqBody = request.body;
    const userID = request.user;
    const newCart = new Cart(reqBody);
    if (userID.id !== reqBody.user) {
      response.status(401).json({ message: "Unauthorized user" });
    } else {
      const findFoodMenu = await Menu.findById(reqBody.foodMenu);
      if (!findFoodMenu) {
        response.status(404).json({ message: "Food not available in store" });
      } else {
        newCart.subTotal = findFoodMenu.price * newCart.quantity;
      }

      await newCart.save();

      const userOrder = await Order.findOne({ user: userID });
      if (!userOrder) {
        await Order.create({
          user: userID,
          cartId: [newCart.id],
          total: newCart.subTotal,
        });
      } else {
        const orderCart = [...userOrder.cartId, newCart.id];
        const newTotal = userOrder.total + newCart.subTotal;

        const update = {
          cartId: orderCart,
          total: newTotal,
        };
        await Order.findOneAndUpdate({ user: userID }, update, { new: true });
      }
      response.status(201).json({
        status: true,
        mesaage: "Added to cart successfully",
        data: newCart,
      });
    }
  } catch (err) {
    console.log(err);
    response.status(400).json({ mesaage: "Incomplete requirements" });
  }
};
// To increase the quantity of the foodMenu on the cart
exports.updateCart = async (request, response) => {
  try {
    const reqBody = request.body;
    const cartID = request.params.id;
    const findCart = await Cart.findById(cartID);
    const user = request.user;
    if (findCart && findCart.user.toString() === user._id.toString()) {
      findCart.quantity += reqBody.quantity;
      const findFoodMenu = await Menu.findById(findCart.foodMenu);
      if (findFoodMenu) {
        newSubTotal = findFoodMenu.price * findCart.quantity;
      }
      await Cart.findByIdAndUpdate(cartID, { subTotal: newSubTotal });

      const userOrder = await Order.findOne({ user: reqBody.user });
      if (!userOrder) {
        response.status(401).json({ message: "Incorrect userID " });
      }
      userOrder.total -= findCart.subTotal;
      const newTotal = userOrder.total + newSubTotal;

      const update = {
        total: newTotal,
      };
      await Order.findOneAndUpdate({ user: user }, update, { new: true });

      response.status(200).json({
        status: true,
        message: "Cart updated successfully",
        data: findCart,
      });
    } else {
      response.status(401).json({ message: "Unauthorized user" });
    }
  } catch (err) {
    response.status(400).json({ mesaage: "Incomplete requirements" });
  }
};

exports.getCart = async (request, response) => {
  try {
    // const userID = request.params.id;
    const userID = request.user;
    const reqBody = request.body;
    if (userID.id !== reqBody.user) {
      response.status(401).json({ message: "Unauthorized user" });
    } else {
      const findAllCart = await Cart.find({ user: reqBody.user });

      if (findAllCart) {
        response.status(200).json({
          status: true,
          message: "All carts found",
          quantity: findAllCart.length,
          total: await sumAllCart(findAllCart),
          data: findAllCart,
        });
      } else {
        response.status(200).json({ status: failed, message: "No cart found" });
      }
    }
  } catch (err) {
    response.status(400).json({ mesaage: "Incomplete requirements" });
  }
};

exports.deleteCart = async (request, response) => {
  try {
    const cartID = request.params.id;
    const reqBody = request.body;
    const findCart = await Cart.findById(cartID);
    const cartUser = await User.findById(findCart.user);
    if (findCart && cartUser.id === reqBody.user) {
      const userOrder = await Order.findOne({ user: reqBody.user });

      let amount = userOrder.total - findCart.subTotal;
      const cart_id = userOrder.cartId.filter(
        (id) => id.toString() !== findCart._id.toString()
      );
      const update = {
        total: amount,
        cartId: cart_id,
      };

      const cartDelete = await Cart.findByIdAndDelete(cartID);
      if (cart_id.length === 0) {
        //if greater than 0
        await Order.findOneAndDelete({ user: reqBody.user });
      }
      await Order.findOneAndUpdate(
        { user: reqBody.user },
        { $set: update },
        { new: true }
      );
      response.status(200).json({
        status: true,
        message: "Cart deleted successfully",
        data: cartDelete,
      });
    } else {
      response.status(401).json({ message: "Unauthorized user" });
    }
  } catch (err) {
    console.log(err);
    response.status(400).json({ message: "Incomplete requirements" });
  }
};
