const Product = require("../models/products");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    docTitle: "Add Product",
    path: "/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;

  const product = new Product(title, imageUrl, description, price);
  product.save();
  res.redirect("/");
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.fetchAll();
    res.render("admin/all-products", {
      prods: products,
      docTitle: "All Products",
      path: "/all-products",
      hasProduct: products.length > 0,
      activeShop: true,
      productCSS: true,
    });
  } catch (err) {
    console.log(err);
    res.render("admin/all-products", {
      prods: [],
      docTitle: "All Products",
      path: "/all-products",
      hasProduct: false,
      activeShop: false,
      productCSS: false,
    });
  }
};
