const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Flutterwave = require("flutterwave-node-v3");
const nodemailer = require("nodemailer");
const newEmail = require("../utils/email");
const orderHistory = require("../models/orderHistory");

const flw = new Flutterwave(
  process.env.FLW_PUBLIC_KEY,
  process.env.FLW_SECRET_KEY
);

exports.checkOut = async (request, res) => {
  try {
    const orderID = request.params.id;
    const user = request.user;
    const findOrder = await Order.findById(orderID);
    if (findOrder && findOrder.user.toString() === user.id.toString()) {
      let payload = request.body;
      try {
        payload = {
          ...payload,
          amount: findOrder.total,
          tx_ref: "hy_ " + Math.floor(Math.random() * 1000000000 + 1),
          enckey: process.env.FLW_ENCRYPTION_KEY,
        };
        const response = await flw.Charge.card(payload);

        // For PIN transactions
        if (response.meta.authorization.mode === "pin") {
          let payload2 = payload;
          payload2.authorization = {
            mode: "pin",
            fields: ["pin"],
            pin: 3310,
          };
          const reCallCharge = await flw.Charge.card(payload2);

          // Add the OTP to authorize the transaction
          const callValidate = await flw.Charge.validate({
            otp: "12345",
            flw_ref: reCallCharge.data.flw_ref,
          });

          if (callValidate.status === "success") {
            // let cartItems = await Cart.find({ user: user.id });
            // if (cartItems) {
            //   cartItems.map(async (cartItem) => {
            //     await Cart.findByIdAndDelete(cartItem._id);
            //   });
            // }
            await newEmail({
              email: "chidubemobinwanne@gmail.com",
              subject: "Order Completed from Food App",
              text: findOrder,
            });

            const changeStatus = await Cart.updateMany(
              { user: user.id },
              { status: true }
            );
            // console.log(orderItems);

            await orderHistory.create({
              user: user,
              items: findOrder.cartId,
              total: findOrder.total,
            });

            await Order.findByIdAndDelete(orderID);

            res.status(200).json({
              status: "success",
              message: "Order completed successfully",
            });
          }

          //   let mail = nodemailer.createTransport({
          //     service: "gmail",
          //     auth: {
          //       user: process.env.EMAIL_USER,
          //       pass: process.env.EMAIL_PASS,
          //     },
          //   });

          //   const mailOptions = {
          //     from: process.env.EMAIL_USER,
          //     to: "chidubemobinwanne@gmail.com",
          //     subject: "Order Completed from Food App",
          //     text: JSON.stringify(findOrder),
          //   };

          //   mail.sendMail(mailOptions, function (error, info) {
          //     if (error) {
          //       console.log(error);
          //     } else {
          //       console.log("Email sent: " + info.response);
          //     }
          //   });
          if (callValidate.status === "error") {
             res.status(400).send("please try again");
          } else {
            return res.status(400).send("payment failed");
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      response.status(401).json({ message: "Unauthorized user" });
    }
  } catch (err) {
    console.log(err);
    response.status(400).json({ message: "Incomplete requirements" });
  }
};
