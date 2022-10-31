const express = require("express");
const OrderController = require("../controllers/orderController");
const { checkOut } = require("../controllers/checkoutController");
const { auth, checkUser } = require("../middlewares/authMiddleware");
const app = express();

app.use(express.json());
const router = express.Router();

const { getAllOrders, getOrder } = OrderController;
router.get("/order", auth, checkUser("admin"), getAllOrders);
router.get("/order/:id", auth, getOrder);

router.post("/checkout/:id", auth, checkOut);

module.exports = router;
