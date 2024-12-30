const Product = require("../models/products");


// @ts-ignore
// @ts-ignore
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    return res.render("admin/all-products", {
      products,
      docTitle: "All Products",
      path: "/all-products",
      hasProduct: products.length > 0,
      isAuthenticated: req.isLoggedIn
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
    const product = new Product({
      title,
      price,
      description,
      imageUrl,
      userId: req.user._id,
    });
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
// @ts-ignore
exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    docTitle: "Add Product",
    path: "/add-product",
    isAuthenticated: req.isLoggedIn
  });
};

// @ts-ignore
exports.editProduct = async (req, res, next) => {
  const productId = req.params.productId;
  console.log("Product ID:", productId);


  if (!productId) {
    return res.redirect("/all-products");
  }

  try {
    const product = await Product.findById(productId);

    console.log(product)

    // if (!product) {
    //   return res.redirect("/all-products");
    // }

    // Render the edit-product page with the fetched product
    res.render("admin/edit-product", {
      product,
      // @ts-ignore
      docTitle: `Edit ${product[0].title}`,
      path: `/edit-product/${productId}`,
      isAuthenticated: req.isLoggedIn
    });
  } catch (err) {
    console.error("Error fetching product for editing:", err);
    res.status(500).redirect("/all-products");
  }
};

exports.updateProduct = async (req, res) => {
  console.log("Update product function called");
  const { productId } = req.params; // Use `req.params` to get the `productId` from the URL
  const { title, imageUrl, price, description } = req.body;

  console.log('Product ID:', productId);
  console.log('Form Data:', req.body);

  const updatedData = { title, imageUrl, price, description };

  try {
    const result = await Product.findByIdAndUpdate(productId, updatedData, { new: true });

    console.log('Update result:', result);

    if (!result) {
      return res.status(404).json({ message: "Product not found or no changes made" });
    }

    res.status(200).redirect("/all-products");
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ message: "Error updating product" });
  }
};


exports.deleteProduct = async (req, res) => {
  const { productId } = req.body;

  try {
    const result = await Product.findByIdAndDelete(productId);

    // @ts-ignore
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).redirect("/all-products");
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ message: "Error deleting product" });
  }
};