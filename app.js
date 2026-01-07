const express = require("express");
const app = express();

const connectDB = require("./database/database");

require("dotenv").config();
connectDB();

const authRoute = require("./routes/authRoute");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT;

app.use("", authRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
