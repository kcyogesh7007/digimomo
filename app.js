const express = require("express");
const app = express();

const connectDB = require("./database/database");

require("dotenv").config();
connectDB();

const authRoute = require("./routes/authRoute");
const productRoute = require("./routes/productRoute");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("./uploads"));

const PORT = process.env.PORT;

app.use("/api", authRoute);
app.use("/api", productRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
