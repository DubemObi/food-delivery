const express = require("express");
const ReviewController = require("../controllers/reviewController");
const { auth, checkUser } = require("../middlewares/authMiddleware");
const app = express();

app.use(express.json());
const router = express.Router();

const { createReview, updateReview, getAllReview, deleteReview } =
  ReviewController;
router.route("/").get(auth, checkUser("admin"), getAllReview);

router
  .route("/:id")
  .put(auth, updateReview)
  .delete(auth, deleteReview)
  .post(auth, createReview);

module.exports = router;
