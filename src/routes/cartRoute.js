const express = require("express");
const CartController = require("../controllers/cartController");
const { auth, checkUser } = require("../middlewares/authMiddleware");
const app = express();

app.use(express.json());
const router = express.Router();

const { addToCart, updateCart, getCart, deleteCart } = CartController;

router.route("/cart").post(auth, addToCart).get(auth, getCart);
router.delete("/cart/:id", auth, deleteCart);

router.put("/cart/:id", auth, updateCart);

module.exports = router;
