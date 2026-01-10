const User = require("../../../model/userModel");

exports.getUser = async (req, res) => {
  const user = await User.find().select("-userPassword");
  res.status(200).json({
    message: "User fetched successfully",
    data: user,
  });
};
