const Cart = require("../models/cart");
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

exports.editProduct = async (req, res, next) => {
  const productId = req.query.productId;
  if (!productId) {
    return res.redirect("/products");
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.redirect("/products");
    }

    res.render("admin/edit-product", {
      product,
      docTitle: `Edit ${product.title}`,
      path: `/edit-product?productId=${productId}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).redirect("/products");
  }
};


exports.updateProduct = async (req, res, next) => {
  const { productId, title, imageUrl, price, description } = req.body;

  try {
    await Product.update(productId, { title, imageUrl, price, description });
    res.redirect("/products");
  } catch (err) {
    console.error(err);
    res.status(500).redirect("/products");
  }
};

exports.deleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  try {
    const products = await Product.readFile();
    const updatedProducts = products.filter((product) => product.id !== prodId);
    await Product.writeFile(updatedProducts);

    await Cart.removeProduct(prodId);

    res.redirect("/products");
  } catch (err) {
    console.error("Error deleting product:", err);
    res.redirect("/products");
  }
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
