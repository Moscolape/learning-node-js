const Product = require("../models/products");
const Cart = require("../models/cart");

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

exports.getCart = async (req, res, next) => {
  try {
    const cart = await Cart.getCart();
    const products = await Product.fetchAll();
    const cartProducts = cart.products.map((cartItem) => {
      const product = products.find((prod) => prod.id === cartItem.id);
      return { ...product, qty: cartItem.qty };
    });

    res.render("shop/cart", {
      cartProducts,
      totalPrice: cart.totalPrice,
      docTitle: "Your Cart",
      path: "/carts",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.updateCart = async (req, res, next) => {
  const prodId = req.body.productId;
  const action = req.body.action;
  const product = await Product.findById(prodId);

  if (product) {
    await Cart.addProduct(prodId, product.price, action);
  }
  res.redirect("/carts");
};

exports.addToCart = async (req, res, next) => {
  const prodId = req.body.productId;
  try {
    const product = await Product.findById(prodId);
    if (product) {
      await Cart.addProduct(prodId, product.price);
    }
    res.redirect("/carts");
  } catch (err) {
    console.log(err);
    res.redirect("/carts");
  }
};

exports.removeFromCart = async (req, res, next) => {
  const prodId = req.body.productId;
  try {
    const product = await Product.findById(prodId);
    if (product) {
      await Cart.removeProduct(prodId);
    }
    res.redirect("/carts");
  } catch (err) {
    console.log(err);
    res.redirect("/carts");
  }
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
