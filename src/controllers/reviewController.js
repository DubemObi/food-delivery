const Review = require("../models/reviewModel");
const OrderHistory = require("../models/orderHistory");

exports.createReview = async (request, response) => {
  try {
    const { rating, review } = request.body;
    const orderHistoryID = request.params.id;
    const userID = request.user;

    const newReview = await Review.create({
      user: userID,
      rating,
      review,
    });

    const updateReview = await OrderHistory.findByIdAndUpdate(orderHistoryID, {
      rating: rating,
      review: review,
    });

    response.status(201).json({
      status: true,
      mesaage: "New review added",
      data: newReview,
    });
  } catch (err) {
    response.status(400).json({ mesaage: "Incomplete requirements" });
  }
};

exports.updateReview = async (request, response) => {
  try {
    const { rating, review } = request.body;
    const reviewID = request.params.id;
    const findReview = await Review.findById(reviewID);
    const user = request.user;
    if (findReview) {
      const update = {
        rating: rating,
        review: review,
      };

      const updatedReview = await Review.findByIdAndUpdate(reviewID, update, {
        new: true,
      });

      return response.status(200).json({
        status: true,
        message: "Review updated successfully",
        data: updatedReview,
      });
    } else {
      response.status(401).json({ message: "No review found" });
    }
  } catch (err) {
    response.status(400).json({ mesaage: "Incomplete requirements" });
  }
};

exports.getAllReview = async (request, response) => {
  const findAllReview = await Review.find();
  return response.status(200).send({
    status: true,
    message: "All reviews",
    data: findAllReview,
  });
};

exports.deleteReview = async (request, response) => {
  const { id } = request.params;
  const findReview = await Review.findByIdAndDelete(id);
  if (findReview) {
    return response.status(200).send({
      status: true,
      message: "Review deleted successfully",
    });
  } else {
    return response.status(409).send({
      status: false,
      message: "Review not found",
    });
  }
};
