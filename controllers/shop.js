const Product = require("../models/products");

// @ts-ignore
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.fetchAll();

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

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).render("not-found", {
        docTitle: "Product Not Found",
        path: "/not-found",
      });
    }

    return res.render("shop/product-details", {
      product,
      docTitle: product.title,
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
    const products = await Product.fetchAll();

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
exports.getCart = async (req, res) => {
  try {
    const cartProducts = await req.user.getCart();

    let totalPrice = 0;
    cartProducts.forEach(product => {
      totalPrice += product.price * product.qty;
    });

    res.render("shop/cart", {
      path: "/carts",
      docTitle: "Your Cart",
      products: cartProducts,
      totalPrice,
    });
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ message: "Error fetching cart." });
  }
};


// @ts-ignore
exports.addToCart = async (req, res) => {
  const prodId = req.body.productId;

  try {
    const product = await Product.findById(prodId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    await req.user.addToCart(product);
    res.redirect("/carts");
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ message: "Error adding to cart." });
  }
};


// @ts-ignore
exports.removeCartItem = async (req, res) => {
  const { productId } = req.body;

  try {
    // Use the logged-in user to call the removeFromCart method
    await req.user.removeFromCart(productId);

    // Redirect to the cart page after removing the item
    res.redirect("/carts");
  } catch (err) {
    console.error("Error removing item from cart:", err);
    res.status(500).json({ message: "Error removing item from cart." });
  }
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .addOrder()
    .then(result => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        docTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => console.log(err));
};

// @ts-ignore
exports.getCheckout = (req, res) => {
  res.render("shop/checkout", {
    docTitle: "Checkout",
    path: "/checkout",
  });
};
