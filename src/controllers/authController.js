const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const handleError = require("../utils/authError");
const { createToken } = require("../middlewares/authMiddleware");
const Token = require("../models/tokenModel");
const newEmail = require("../utils/email");
const crypto = require("crypto");

//Cookie Availability Span
const maxAge = 3 * 24 * 60 * 60;

exports.signUp = async (req, res) => {
  try {
    const {
      fullname,
      email,
      password,
      confirmPassword,
      phoneNumber,
      address,
      role,
    } = req.body;
    if (password !== confirmPassword) {
      res.status(400).json({ message: "Wrong Password input" });
    }
    const salt = await bcrypt.genSalt(10);

    if (password === confirmPassword && password.length > 5) {
      const hash = await bcrypt.hash(password, salt);
      const user = await User.create({
        fullname,
        email,
        password: hash,
        confirmPassword: hash,
        phoneNumber,
        address,
        role,
      });

      const token = createToken(user._id);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      // await new Token({
      //   userId: user._id,
      //   token: token,
      //   createdAt: Date.now(),
      // }).save();
      return res.status(201).json({
        status: "success",
        token,
        data: {
          user,
        },
      });
    }
    return res
      .status(400)
      .json({ message: "Password is less than 6 characters" });
  } catch (error) {
    const errors = handleError(error);
    res.status(404).json({ errors });
  }
};

//Log user in
exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        const token = await createToken(user._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({
          status: "success",
          token,
          data: {
            user,
          },
        });
      } else {
        res.status(401).json({
          status: "fail",
          message: "Invalid email or password",
        });
      }
    }
  } catch (err) {
    const errors = handleError(err);
    res.status(400).json({
      status: "fail",
      message: errors,
    });
  }
};

//Logout
exports.logout = async (req, res) => {
  try {
    res.status(200).json({ message: "You've successfully logged out" });
  } catch (error) {
    res.status(404).json({ message: "Account not logged out" });
  }
};

exports.resetPasswordRequest = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(400).send("user with given email doesn't exist");

    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    const link = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auths/reset-password/${token.token}`;
    await newEmail({
      email: req.body.email,
      subject: "Password reset",
      text: link,
    });

    res.status(200).json({
      status: "success",
      message: "password reset link sent to your email account",
    });
  } catch (error) {
    res.send("An error occured");
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const token = await Token.findOne({
      token: req.params.token,
    });
    if (!token) return res.status(400).send("Invalid link or expired");

    const user = await User.findById(token.userId);
    if (!user) return res.status(400).send("User not found");
    if (req.body.password.length > 5) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);
      user.password = hash;
      user.confirmPassword = user.password;

      await user.save();
      await token.delete();

      res.send("password reset sucessfully.");
    }
  } catch (error) {
    res.send("An error occured");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({ _id: req.user.id });
    if (!deletedUser) {
      await Token.findOneAndDelete({ userId: req.user.id });
      return res.status(400).json({ message: "unable to delete account" });
    }
    return res.status(200).json({
      success: true,
      message: "account deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
