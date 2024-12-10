const Product = require("../models/products");
// const Cart = require("../models/cart");

// @ts-ignore
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();

    return res.render("shop/product-list", {
      products,
      docTitle: "Products",
      path: "/products",
      hasProduct: products.length > 0,
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    return res.status(500).json({ message: "Error fetching products" });
  }
};

// @ts-ignore
exports.getThisProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    console.log(id);
    console.log(product);

    if (!product) {
      return res.status(404).render("not-found", {
        docTitle: "Product Not Found",
        path: "/not-found",
      });
    }

    return res.render("shop/product-details", {
      product,
      docTitle: product.dataValues.title,
      path: `/products/${id}`,
    });
  } catch (err) {
    console.error("Error fetching product:", err);
    return res.status(500).json({ message: "Error fetching product" });
  }
};

// @ts-ignore
exports.getIndex = async (req, res) => {
  try {
    const products = await Product.findAll();

    return res.render("shop/index", {
      products,
      docTitle: "Shop",
      path: "/",
      hasProduct: products.length > 0,
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    return res.status(500).json({ message: "Error fetching products" });
  }
};

// @ts-ignore
exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) =>
      cart
        .getProducts()
        .then((products) => {
          res.render("shop/cart", {
            products,
            totalPrice: cart.totalPrice,
            docTitle: "Your Cart",
            path: "/carts",
          });
        })

        .catch((err) => console.log(err))
    )
    .catch((err) => console.log(err));
};

// @ts-ignore
exports.updateCart = async (req, res, next) => {
  // const prodId = req.body.productId;
  // const action = req.body.action;
  // const product = await Product.findById(prodId);
  // // @ts-ignore
  // if (product) {
  //   // @ts-ignore
  //   await Cart.addProduct(prodId, product.price, action);
  // }
  // res.redirect("/carts");
};

// @ts-ignore
exports.addToCart = async (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      });
    })
    .then(() => {
      res.redirect('/carts');
    })
    .catch(err => console.log(err));
};

// @ts-ignore
exports.removeFromCart = async (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

// @ts-ignore
exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    docTitle: "Your Orders",
    path: "/orders",
  });
};

// @ts-ignore
exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    docTitle: "Checkout",
    path: "/checkout",
  });
};
