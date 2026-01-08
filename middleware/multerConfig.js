const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error("This file is not supported"));
      return;
    }
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

module.exports = { multer, storage };
