const express = require("express");
const MenuController = require("../controllers/menuController");
const { auth, checkUser } = require("../middlewares/authMiddleware");
const app = express();

app.use(express.json());
const router = express.Router();

const {
  createMenu,
  updateMenu,
  getOneMenu,
  getAllMenu,
  deleteMenu,
  uploadImage,
  resizeImage,
} = MenuController;
router
  .route("/menu")
  .post(auth, checkUser("admin"), uploadImage, resizeImage, createMenu)
  .get(auth, getAllMenu)
  .delete(auth, checkUser("admin"), deleteMenu);

router.get("/menu/:id", auth, getOneMenu);

router.put(
  "/menu/:id",
  auth,
  checkUser("admin"),
  // uploadImage,
  // resizeImage,
  updateMenu
);
module.exports = router;
