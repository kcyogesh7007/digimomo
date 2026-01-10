const express = require("express");
const app = express();

const connectDB = require("./database/database");

require("dotenv").config();
connectDB();

const authRoute = require("./routes/authRoute");
const productRoute = require("./routes/productRoute");
const adminUserRoute = require("./routes/adminUserRoute");
const userReviewRoute = require("./routes/userReviewRoute");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("./uploads"));

const PORT = process.env.PORT;

app.use("/api", authRoute);
app.use("/api", productRoute);
app.use("/api", adminUserRoute);
app.use("/api", userReviewRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
