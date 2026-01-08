const Product = require("../../../model/productModel");

exports.createProduct = async (req, res) => {
  const file = req.file;
  let filepath;
  if (!file) {
    filepath =
      "https://imgs.search.brave.com/r2DC0zQsYpNG48dAlda0XyANu_S2-Q7sb6eL94O1q2o/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS12ZWN0b3Iv/d2hpdGUtcHJvZHVj/dC1wb2RpdW0td2l0/aC1ncmVlbi10cm9w/aWNhbC1wYWxtLWxl/YXZlcy1nb2xkZW4t/cm91bmQtYXJjaC1n/cmVlbi13YWxsXzg3/NTIxLTMwMjMuanBn/P3NlbXQ9YWlzX2h5/YnJpZCZ3PTc0MCZx/PTgw";
  } else {
    filepath = "localhost:3000/" + req.file.filename;
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
