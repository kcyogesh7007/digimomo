const { getUser } = require("../controller/admin/user/userController");
const isAuthenticated = require("../middleware/isAuthenticated");
const isRestrictTo = require("../middleware/isRestrictTo");
const catchAsync = require("../services/catchAsync");

const router = require("express").Router();

router
  .route("/users")
  .get(isAuthenticated, isRestrictTo("admin"), catchAsync(getUser));

module.exports = router;
