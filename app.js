const express = require("express");
const app = express();

const connectDB = require("./database/database");

require("dotenv").config();
connectDB();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./model/userModel");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.status(200).json({
    message: "I am alive",
  });
});

//register user
app.post("/register", async (req, res) => {
  const { email, phoneNumber, password, userName } = req.body;
  if (!email || !phoneNumber || !password || !userName) {
    return res.status(400).json({
      message: "Please provide email,phone number,password and userName",
    });
  }
  const userFound = await User.findOne({ userEmail: email });
  if (userFound) {
    return res.status(400).json({
      message: "User with that email is not registered",
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
});

//login
app.post("/login", async (req, res) => {
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
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
