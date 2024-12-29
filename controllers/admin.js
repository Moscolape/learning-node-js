const Product = require("../models/products"); // Import the Product model

// @ts-ignore
exports.getProducts = async (req, res) => {
  try {
    // Fetch all products using the MongoDB model's fetchAll method
    const products = await Product.fetchAll();

    return res.render("admin/all-products", {
      products,
      docTitle: "All Products",
      path: "/all-products",
      hasProduct: products.length > 0,
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    return res.status(500).json({ message: "Error fetching products" });
  }
};

// @ts-ignore
exports.postAddProduct = async (req, res) => {
  try {
    const { title, imageUrl, price, description } = req.body;

    // Create a new product instance and save it using the MongoDB model
    const product = new Product(title, price, description, imageUrl, null, req.user._id);
    await product.save();

    console.log("Product created:", product);

    return res.status(201).redirect("/all-products");
  } catch (err) {
    console.error("Error saving product:", err);
    return res
      .status(500)
      .json({ message: "Error saving product", error: err.message });
  }
};

// @ts-ignore
exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    docTitle: "Add Product",
    path: "/add-product",
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

    // Render the edit-product page with the fetched product
    res.render("admin/edit-product", {
      product,
      // @ts-ignore
      docTitle: `Edit ${product.title}`,
      path: `/edit-product?productId=${productId}`,
    });
  } catch (err) {
    console.error("Error fetching product for editing:", err);
    res.status(500).redirect("/products");
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { title, imageUrl, price, description } = req.body;

  const updatedData = { title, imageUrl, price, description };

  try {
    const result = await Product.updateById(id, updatedData);

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Product not found or no changes made" });
    }

    res.status(200).redirect("/all-products");
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ message: "Error updating product" });
  }
};



exports.deleteProduct = async (req, res) => {
  const id = req.body.productId;

  try {
    const result = await Product.deleteById(id);

    console.log(id);
    console.log(result);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).redirect("/all-products");
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ message: "Error deleting product" });
  }
};