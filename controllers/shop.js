const Product = require("../models/products");
const Order = require("../models/order");

const fs = require("fs");
const path = require("path");

// @ts-ignore
const stripe = require('stripe')('sk_test_51MKWKZL62I7919FYJvHeGUQrDDkqq5E8Q98S4ZcElvyDMfBHQEdPDw1HRVZmx1IH5FmLUfnOdjOCYTi22IUNSJkO00VxrHFkPa');


const PDFDocument = require("pdfkit");
const { getProducts } = require("./admin");

const ITEMS_PER_PAGE = 2;

// Fetch all products
exports.getAllProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;

  try {
    // Count total number of products in the database
    const totalProducts = await Product.countDocuments();

    // Fetch paginated products
    const products = await Product.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    // Calculate total pages
    const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

    // Render the page with additional data
    return res.render("shop/product-list", {
      products,
      docTitle: "Products",
      path: "/products",
      hasProduct: products.length > 0,
      totalProducts,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      previousPage: page > 1 ? page - 1 : null,
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

// Fetch all products for the index page
exports.getIndex = async (req, res) => {
  const page = parseInt(req.query.page) || 1;

  try {
    // Count total number of products in the database
    const totalProducts = await Product.countDocuments();

    // Fetch paginated products
    const products = await Product.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    // Calculate total pages
    const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

    // Render the page with additional data
    return res.render("shop/index", {
      products,
      docTitle: "Shop",
      path: "/",
      hasProduct: products.length > 0,
      totalProducts,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      previousPage: page > 1 ? page - 1 : null
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
    cartProducts.forEach((product) => {
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

  console.log("Product ID received:", productId);

  try {
    const product = await Product.findById(productId);
    console.log(product);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Ensure productId is passed correctly to addToCart method
    await req.user.addToCart(product); // Assumes addToCart method is implemented in the User model
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
    await req.user.removeFromCart(productId);

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
  if (!req.user) {
    console.error("User not found in request.");
    return res
      .status(401)
      .json({ message: "User not logged in or does not exist." });
  }

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

exports.getInvoice = async (req, res, next) => {
  const orderId = req.params.orderId;
  const userId = req.user._id;

  try {
    // Find the order by ID and ensure the user matches
    const order = await Order.findOne({ _id: orderId, "user._id": userId });

    if (!order) {
      const error = new Error("Order not found or access denied.");
      // @ts-ignore
      error.statusCode = 403;
      throw error;
    }

    // Generate the PDF
    const invoiceName = `invoice-${orderId}.pdf`;
    const invoicePath = path.join("invoices", invoiceName);

    const pdfDoc = new PDFDocument();

    // Stream the PDF directly to the response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${invoiceName}"`
    );

    pdfDoc.pipe(fs.createWriteStream(invoicePath)); // Save PDF to server
    pdfDoc.pipe(res); // Stream PDF to client

    // Add content to the PDF
    pdfDoc.fontSize(20).text("Invoice", { underline: true });
    pdfDoc.text("----------------------------");
    pdfDoc.fontSize(16).text(`Order ID: ${order._id}`);
    pdfDoc.text(`Date: ${new Date().toLocaleDateString()}`);
    pdfDoc.text("----------------------------");

    let totalPrice = 0;

    order.items.forEach((item) => {
      totalPrice += item.quantity * item.price;
      pdfDoc
        .fontSize(14)
        .text(
          `${item.title} - ${item.quantity} x $${item.price.toFixed(2)} = $${(
            item.quantity * item.price
          ).toFixed(2)}`
        );
    });

    pdfDoc.text("----------------------------");
    pdfDoc.fontSize(16).text(`Total Price: $${totalPrice.toFixed(2)}`);
    pdfDoc.text("----------------------------");

    pdfDoc.end(); // Finalize the PDF document
  } catch (err) {
    console.error("Error fetching invoice:", err.message);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Checkout page
// exports.getCheckout = async (req, res) => {
//   const YOUR_DOMAIN = 'http://localhost:4000';

//   try {
//     const cartProducts = await req.user.getCart();
//     console.log(cartProducts);

//     let totalPrice = 0;
//     cartProducts.forEach((product) => {
//       totalPrice += product.price * product.quantity;
//     });

//     const session = await stripe.checkout.sessions.create({
//       line_items: cartProducts.map(p => {
//         return {
//           price: p._id.toString()
//         }
//       }),
//       mode: 'payment',
//       success_url: `${YOUR_DOMAIN}/success.html`,
//       cancel_url: `${YOUR_DOMAIN}/cancel.html`,
//       payment_method_types: ['card']
//     });
    
//     return res.render("shop/checkout", {
//       docTitle: "Checkout",
//       path: "/checkout",
//       products: cartProducts,
//       totalPrice,
//       sessionId: session.id
//     });
//   } catch (err) {
//     console.error("Error fetching cart:", err);
//     return res.status(500).json({ message: "Error fetching cart." });
//   }
// };
