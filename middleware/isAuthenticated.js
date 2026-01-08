const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(400).json({
      message: "Please login",
    });
  }

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);
    const userExist = await User.findById(decoded.id);
    if (!userExist) {
      return res.status(400).json({
        message: "User doesnot exist with that id",
      });
    }
    req.user = userExist;
    next();
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = isAuthenticated;
