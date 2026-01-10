const {
  createReview,
  getProductReview,
  deleteReview,
} = require("../controller/user/ReviewController");
const isAuthenticated = require("../middleware/isAuthenticated");
const catchAsync = require("../services/catchAsync");

const router = require("express").Router();

router
  .route("/reviews/:id")
  .post(isAuthenticated, catchAsync(createReview))
  .get(catchAsync(getProductReview))
  .delete(isAuthenticated, catchAsync(deleteReview));

module.exports = router;
