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
const deliveryFee = 500;
exports.addToCart = async (request, response) => {
  try {
    const { foodMenu, quantity } = request.body;
    const userID = request.user;
    const findFoodMenu = await Menu.findById(foodMenu);
    if (!findFoodMenu) {
      response.status(404).json({ message: "Food not available in store" });
    }
    const newSubTotal = findFoodMenu.price * quantity;

    const newCart = await Cart.create({
      user: userID,
      foodMenu,
      quantity,
      subTotal: newSubTotal,
    });

    const userOrder = await Order.findOne({ user: userID.id });
    if (!userOrder) {
      await Order.create({
        user: userID,
        cartId: [newCart.id],
        total: newCart.subTotal + deliveryFee,
      });
    } else {
      const orderCart = [...userOrder.cartId, newCart.id];
      const newTotal = userOrder.total + newCart.subTotal;

      const update = {
        cartId: orderCart,
        total: newTotal + deliveryFee,
      };
      await Order.findOneAndUpdate({ user: userID }, update, { new: true });
    }
    response.status(201).json({
      status: true,
      mesaage: "Added to cart successfully",
      data: newCart,
    });
  } catch (err) {
    console.log(err);
    response.status(400).json({ mesaage: "Incomplete requirements" });
  }
};
// To increase the quantity of the foodMenu on the cart
exports.updateCart = async (request, response) => {
  try {
    const { quantity } = request.body;
    const cartID = request.params.id;
    const findCart = await Cart.findById(cartID);
    const user = request.user;
    let newSubTotal;
    if (
      findCart &&
      findCart.status === false &&
      findCart.user.toString() === user._id.toString()
    ) {
      const findFoodMenu = await Menu.findById(findCart.foodMenu);
      if (findFoodMenu) {
        newSubTotal = findFoodMenu.price * quantity;

        const cartUpdate = {
          subTotal: newSubTotal,
          quantity: quantity,
        };

        const updatedCart = await Cart.findByIdAndUpdate(cartID, cartUpdate, {
          new: true,
        });
        const userOrder = await Order.findOne({ user: user.id });
        if (!userOrder) {
          response.status(401).json({ message: "Incorrect userID " });
        }
        userOrder.total -= findCart.subTotal;
        const newTotal = userOrder.total + newSubTotal;

        const update = {
          total: newTotal,
        };
        await Order.findOneAndUpdate({ user: user }, update, { new: true });
        return response.status(200).json({
          status: true,
          message: "Cart updated successfully",
          data: updatedCart,
        });
      }
    } else {
      response.status(401).json({ message: "No cart found" });
    }
  } catch (err) {
    response.status(400).json({ mesaage: "Incomplete requirements" });
  }
};

exports.getCart = async (request, response) => {
  try {
    const userID = request.user;
    const findAllCart = await Cart.find({ user: userID, status: false });

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
  } catch (err) {
    response.status(400).json({ mesaage: "Invalid details" });
  }
};

exports.deleteCart = async (request, response) => {
  try {
    const cartID = request.params.id;
    const user = request.user;
    const findCart = await Cart.findById(cartID);
    const cartUser = await User.findById(findCart.user);
    if (findCart && findCart.status === false && cartUser.id === user.id) {
      const userOrder = await Order.findOne({ user: user.id });

      let amount = userOrder.total - findCart.subTotal - deliveryFee;
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
        await Order.findOneAndDelete({ user: user.id });
      }
      await Order.findOneAndUpdate(
        { user: user.id },
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
    response.status(400).json({ message: "Incomplete requirements" });
  }
};
