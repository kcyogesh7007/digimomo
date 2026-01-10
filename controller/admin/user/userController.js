const User = require("../../../model/userModel");

exports.getUser = async (req, res) => {
  const userId = req.user.id;
  const user = await User.find({ _id: { $ne: userId } }).select(
    "-userPassword"
  );
  res.status(200).json({
    message: "User fetched successfully",
    data: user,
  });
};

//delete user

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    return res.status(400).json({
      message: "Please provide Userid",
    });
  }
  const user = await User.findById(userId);
  if (!user) {
    return res.status(400).json({
      message: "No user found ",
    });
  }
  await User.findByIdAndDelete(userId);
  res.status(200).json({
    message: "User deleted successfully",
  });
};
