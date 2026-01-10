const Product = require("../../model/productModel");
const Review = require("../../model/reviewModel");

exports.createReview = async (req, res) => {
  const userId = req.user.id;
  const { rating, message } = req.body;
  const productId = req.params.id;
  if (!rating || !message || !productId) {
    return res.status(400).json({
      message: "Please provide rating,message and productId",
    });
  }
  const productExist = await Product.findById(productId);
  if (!productExist) {
    return res.status(404).json({
      message: "Product doesnot exist with that product id",
    });
  }
  const review = await Review.create({
    userId,
    rating,
    message,
    productId,
  });
  res.status(200).json({
    message: "Review created successfully",
    data: review,
  });
};

exports.getProductReview = async (req, res) => {
  const productId = req.params.id;
  if (!productId) {
    return res.status(400).json({
      message: "Please provide product id",
    });
  }
  const productExist = await Product.findById(productId);
  if (!productExist) {
    return res.status(400).json({
      message: "Product not found with that product Id",
    });
  }
  const reviews = await Review.find({ productId }).populate("userId");
  res.status(200).json({
    message: "Review fetched successfully",
    data: reviews,
  });
};

exports.deleteReview = async (req, res) => {
  const reviewId = req.params.id;
  if (!reviewId) {
    return res.status(400).json({
      message: "please provide review Id",
    });
  }
  await Review.findByIdAndDelete(reviewId);
  res.status(200).json({
    message: "Review deleted successfully",
  });
};
