const Product = require("../models/products");

// Fetch all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    
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

// Fetch a single product by ID
exports.getThisProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id); // Mongoose's findById replaces the custom method

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

// Fetch all products for the index page
exports.getIndex = async (req, res) => {
  try {
    const products = await Product.find();
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

// Fetch cart items
exports.getCart = async (req, res) => {
  try {
    const cartProducts = await req.user.getCart();
    console.log(cartProducts);
    
    let totalPrice = 0;
    cartProducts.forEach(product => {
      totalPrice += product.price * product.quantity;
    });

    return res.render("shop/cart", {
      path: "/carts",
      docTitle: "Your Cart",
      products: cartProducts,
      totalPrice,
    });
  } catch (err) {
    console.error("Error fetching cart:", err);
    return res.status(500).json({ message: "Error fetching cart." });
  }
};

// Add product to cart
exports.addToCart = async (req, res) => {
  const { productId } = req.body;

  console.log("Product ID received:", productId);  // Log productId to ensure it's not undefined

  try {
    const product = await Product.findById(productId);
    console.log(product);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Ensure productId is passed correctly to addToCart method
    await req.user.addToCart(product);  // Assumes addToCart method is implemented in the User model
    return res.redirect("/carts");
  } catch (err) {
    console.error("Error adding to cart:", err);
    return res.status(500).json({ message: "Error adding to cart." });
  }
};


// Remove item from cart
exports.removeCartItem = async (req, res) => {
  const { productId } = req.body;

  try {
    await req.user.removeFromCart(productId); // Assumes `removeFromCart` is implemented in the User model
    return res.redirect("/carts");
  } catch (err) {
    console.error("Error removing item from cart:", err);
    return res.status(500).json({ message: "Error removing item from cart." });
  }
};

// Post an order
exports.postOrder = async (req, res) => {
  try {
    await req.user.addOrder();
    
    return res.redirect("/orders");
  } catch (err) {
    console.error("Error creating order:", err);
    return res.status(500).json({ message: "Error creating order." });
  }
};

// Fetch all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await req.user.getOrders(); // Assumes `getOrders` is implemented in the User model
    return res.render("shop/orders", {
      path: "/orders",
      docTitle: "Your Orders",
      orders,
    });
  } catch (err) {
    console.error("Error fetching orders:", err);
    return res.status(500).json({ message: "Error fetching orders." });
  }
};

// Checkout page
exports.getCheckout = (req, res) => {
  res.render("shop/checkout", {
    docTitle: "Checkout",
    path: "/checkout",
  });
};