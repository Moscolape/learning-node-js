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
    const cart = await req.user.getCart();
    const products = await cart.getProducts();

    const cartProducts = products.map((product) => ({
      id: product.id,
      title: product.title,
      price: product.price,
      qty: product.cartItem.qty,
    }));

    const totalPrice = cartProducts.reduce(
      (sum, product) => sum + product.price * product.qty,
      0
    );

    res.render("shop/cart", {
      products: cartProducts,
      totalPrice,
      path: "/carts",
      docTitle: "Your Cart",
    });
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ message: "Error fetching cart" });
  }
};

// @ts-ignore
exports.addToCart = async (req, res) => {
  const { productId, action } = req.body;

  try {
    const cart = await req.user.getCart();
    const products = await cart.getProducts({ where: { id: productId } });
    const product = products[0];

    if (product) {
      let newQty = product.cartItem.qty;

      if (action === "increase") {
        newQty++;
      } else if (action === "decrease" && newQty > 1) {
        newQty--;
      }

      await product.cartItem.update({ qty: newQty });
    } else if (action === "increase") {
      const productToAdd = await Product.findById(productId);
      await cart.addProduct(productToAdd, { through: { qty: 1 } });
    }

    res.redirect("/carts");
  } catch (err) {
    console.error("Error updating cart:", err);
    res.status(500).json({ message: "Error updating cart" });
  }
};

// @ts-ignore
exports.removeFromCart = async (req, res) => {
  const { productId } = req.body;

  try {
    const cart = await req.user.getCart();
    const products = await cart.getProducts({ where: { id: productId } });

    if (products.length > 0) {
      const product = products[0];
      await product.cartItem.destroy();
    }

    res.redirect("/carts");
  } catch (err) {
    console.error("Error removing product from cart:", err);
    res.status(500).json({ message: "Error removing product from cart" });
  }
};

// @ts-ignore
exports.getOrders = async (req, res) => {
  try {
    const orders = await req.user.getOrders({ include: ["products"] });

    res.render("shop/orders", {
      docTitle: "Your Orders",
      path: "/orders",
      orders,
    });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

// @ts-ignore
exports.getCheckout = (req, res) => {
  res.render("shop/checkout", {
    docTitle: "Checkout",
    path: "/checkout",
  });
};
