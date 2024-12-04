const Product = require("../models/products");

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.fetchAll();
    res.render("shop/product-list", {
      prods: products,
      docTitle: "Products",
      path: "/products",
      hasProduct: products.length > 0,
      activeShop: true,
      productCSS: true,
    });
  } catch (err) {
    console.log(err);
    res.render("shop/product-list", {
      prods: [],
      docTitle: "Products",
      path: "/products",
      hasProduct: false,
      activeShop: false,
      productCSS: false,
    });
  }
};

exports.getThisProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  try {
    const product = await Product.findById(prodId);
    if (!product) {
      return res.status(404).render("shop/product-details", {
        product: null,
        docTitle: "Product Not Found",
        path: `/products/:${prodId}`,
      });
    }
    res.render("shop/product-details", {
      product: product,
      docTitle: product.title,
      path: `/products/:${prodId}`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).render("shop/product-details", {
      product: null,
      docTitle: "Error",
      path: `/products/:${prodId}`,
    });
  }
};

exports.getIndex = async (req, res, next) => {
  try {
    const products = await Product.fetchAll();
    res.render("shop/index", {
      prods: products,
      docTitle: "Products",
      path: "/",
      hasProduct: products.length > 0,
      activeShop: true,
      productCSS: true,
    });
  } catch (err) {
    console.log(err);
    res.render("shop/index", {
      prods: [],
      docTitle: "Products",
      path: "/",
      hasProduct: false,
      activeShop: false,
      productCSS: false,
    });
  }
};

exports.getCart = (req, res, next) => {
  res.render("shop/cart", {
    docTitle: "Your Cart",
    path: "/carts",
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    docTitle: "Your Orders",
    path: "/orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    docTitle: "Checkout",
    path: "/checkout",
  });
};
