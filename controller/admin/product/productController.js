const Product = require("../../../model/productModel");
const fs = require("fs");

exports.createProduct = async (req, res) => {
  const file = req.file;
  let filepath;
  if (!file) {
    filepath =
      "https://imgs.search.brave.com/r2DC0zQsYpNG48dAlda0XyANu_S2-Q7sb6eL94O1q2o/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS12ZWN0b3Iv/d2hpdGUtcHJvZHVj/dC1wb2RpdW0td2l0/aC1ncmVlbi10cm9w/aWNhbC1wYWxtLWxl/YXZlcy1nb2xkZW4t/cm91bmQtYXJjaC1n/cmVlbi13YWxsXzg3/NTIxLTMwMjMuanBn/P3NlbXQ9YWlzX2h5/YnJpZCZ3PTc0MCZx/PTgw";
  } else {
    filepath = process.env.BACKEND_URL + req.file.filename;
  }

  const {
    productName,
    productDescription,
    productStockQty,
    productStatus,
    productPrice,
  } = req.body;

  if (
    !productName ||
    !productDescription ||
    !productStockQty ||
    !productStatus ||
    !productPrice
  ) {
    return res.status(400).json({
      message:
        "Please provide productName,productDescription,productStockQty,productPrice and product status",
    });
  }
  const product = await Product.create({
    productName,
    productDescription,
    productStatus,
    productStockQty,
    productPrice,
    productImage: filepath,
  });
  res.status(201).json({
    message: "Product created successfully",
    data: product,
  });
};

//get all products

exports.getProducts = async (req, res) => {
  const products = await Product.find();
  if (products.length == 0) {
    return res.status(400).json({
      message: "No products found",
    });
  }
  res.status(200).json({
    message: "Products fetched successfully",
    data: products,
  });
};

exports.getProduct = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      message: "Please provide product id",
    });
  }
  const product = await Product.findById(id);
  if (!product) {
    res.status(400).json({
      message: "No product found",
    });
  } else {
    res.status(200).json({
      message: "Product fetched succesfully",
      data: product,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      message: "Please provide product Id",
    });
  }
  const oldData = await Product.findById(id);
  if (!oldData) {
    return res.status(400).json({
      message: "No data found with that id",
    });
  }
  const oldImage = oldData.productImage;
  const lengthToCut = process.env.BACKEND_URL.length;
  const finalPathAfterCut = oldImage.slice(lengthToCut);

  fs.unlink("./uploads/" + finalPathAfterCut, (err) => {
    if (err) {
      console.log("error deleting file", err);
    } else {
      console.log("File deleted successfully");
    }
  });

  await Product.findByIdAndDelete(id);
  res.status(200).json({
    message: "Product deleted successfully",
  });
};

exports.editProduct = async (req, res) => {
  const { id } = req.params;

  const {
    productName,
    productDescription,
    productStockQty,
    productStatus,
    productPrice,
  } = req.body;

  if (
    !productName ||
    !productDescription ||
    !productStockQty ||
    !productStatus ||
    !productPrice ||
    !id
  ) {
    return res.status(400).json({
      message:
        "Please provide productName,productDescription,productStockQty,productPrice ,id and product status",
    });
  }
  const oldData = await Product.findById(id);
  if (!oldData) {
    return res.status(400).json({
      message: "No data found with that id",
    });
  }
  const oldImage = oldData.productImage;
  const lengthToCut = process.env.BACKEND_URL.length;
  const finalPathAfterCut = oldImage.slice(lengthToCut);
  if (req.file && req.file.filename) {
    fs.unlink("./uploads/" + finalPathAfterCut, (err) => {
      if (err) {
        console.log("error deleting file", err);
      } else {
        console.log("File deleted successfully");
      }
    });
  }
  const product = await Product.findByIdAndUpdate(
    id,
    {
      productName,
      productDescription,
      productStatus,
      productStockQty,
      productPrice,
      productImage:
        req.file && req.file.filename
          ? process.env.BACKEND_URL + req.file.filename
          : oldImage,
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    message: "Product updated successfully",
    data: product,
  });
};
