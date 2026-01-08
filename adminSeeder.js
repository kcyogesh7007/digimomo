const bcrypt = require("bcryptjs");
const User = require("./model/userModel");

const adminSeeder = async (req, res) => {
  const adminExist = await User.findOne({ userEmail: "admin@gmail.com" });
  if (!adminExist) {
    await User.create({
      userEmail: "admin@gmail.com",
      userPassword: bcrypt.hashSync("admin", 10),
      userName: "admin",
      userPhoneNumber: 9852451236,
      role: "admin",
    });
    console.log("Admin seeded successfully");
  } else {
    console.log("admin already seeded");
  }
};
module.exports = adminSeeder;
