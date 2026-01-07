const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../model/userModel");
const otpGenerator = require("otp-generator");
const sendEmail = require("../../services/sendEmail");

exports.registerUser = async (req, res) => {
  const { email, phoneNumber, password, userName } = req.body;
  if (!email || !phoneNumber || !password || !userName) {
    return res.status(400).json({
      message: "Please provide email,phone number,password and userName",
    });
  }
  const userFound = await User.findOne({ userEmail: email });
  if (userFound) {
    return res.status(400).json({
      message: "User with that email is already registered",
    });
  }
  await User.create({
    userEmail: email,
    userPhoneNumber: phoneNumber,
    userPassword: bcrypt.hashSync(password, 10),
    userName,
  });
  res.status(201).json({
    message: "User registered successfully",
  });
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Please provide email and password",
    });
  }
  const userFound = await User.findOne({ userEmail: email });
  if (!userFound) {
    return res.status(400).json({
      message: "User with that email is not registered",
    });
  }
  const isPasswordMatched = bcrypt.compareSync(
    password,
    userFound.userPassword
  );
  if (!isPasswordMatched) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }
  const token = jwt.sign({ id: userFound._id }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });
  res.status(200).json({
    message: "User logged In successfully",
    token,
  });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      message: "Please provide email",
    });
  }
  const userExist = await User.findOne({
    userEmail: email,
  });
  if (!userExist) {
    return res.status(400).json({
      message: "User is not registered with that email",
    });
  }
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  await sendEmail({
    email,
    subject: "Your OTP for DigitalMOMO ",
    message: `Your OTP for DigitalMOMO is ${otp}. Don't share with anyone.`,
  });
  userExist.otp = otp;
  await userExist.save();
  res.status(200).json({
    message: "OTP sent successfully",
  });
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({
      message: "Please provide email and otp",
    });
  }
  const userExist = await User.findOne({ userEmail: email });
  if (!userExist) {
    return res.status(400).json({
      message: "Email not registered",
    });
  }
  if (userExist.otp != otp) {
    return res.status(400).json({
      message: "Invalid otp",
    });
  }
  userExist.otp = undefined;
  userExist.isOtpVerified = true;
  await userExist.save();
  res.status(200).json({
    message: "Otp verified successfully",
  });
};

exports.resetPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;
  if (!email || !newPassword || !confirmPassword) {
    return res.status(400).json({
      message: "Please provide email,new Password and confirm password",
    });
  }
  const userExist = await User.findOne({ userEmail: email });
  if (!userExist) {
    return res.status(400).json({
      message: "Email not registered",
    });
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      message: "New password doesnot amtch with confirm Password",
    });
  }
  if (!userExist.isOtpVerified) {
    return res.status(400).json({
      message: "You cannot perform this action",
    });
  }
  userExist.userPassword = bcrypt.hashSync(newPassword, 10);
  userExist.isOtpVerified = false;
  await userExist.save();
  res.status(200).json({
    message: "Password reset successfully",
  });
};
