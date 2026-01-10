const {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  editProduct,
} = require("../controller/admin/product/productController");
const isAuthenticated = require("../middleware/isAuthenticated");
const isRestrictTo = require("../middleware/isRestrictTo");

const router = require("express").Router();
const { multer, storage } = require("../middleware/multerConfig");
const catchAsync = require("../services/catchAsync");
const upload = multer({ storage });

router
  .route("/products")
  .post(
    isAuthenticated,
    isRestrictTo("admin"),
    upload.single("productImage"),
    createProduct
  )
  .get(catchAsync(getProducts));

router
  .route("/products/:id")
  .get(catchAsync(getProduct))
  .delete(isAuthenticated, isRestrictTo("admin"), catchAsync(deleteProduct))
  .patch(
    isAuthenticated,
    isRestrictTo("admin"),
    upload.single("productImage"),
    catchAsync(editProduct)
  );

module.exports = router;
