const authController = require("../controllers/authController");
const express = require("express");
const { auth } = require("../middlewares/authMiddleware");

const router = express.Router();

const {
  signIn,
  signUp,
  resetPassword,
  resetPasswordRequest,
  logout,
  deleteUser,
} = authController;

router.post("/signup", signUp);

router.post("/signin", signIn);

router.post("/logout/:id", auth, logout);
router.delete("/delete", auth, deleteUser);

router.post("/reset-password", resetPasswordRequest);

router.patch("/reset-password/:token", resetPassword);

module.exports = router;
