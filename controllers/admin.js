const Product = require("../models/products");
const { validationResult } = require("express-validator");

// @ts-ignore
exports.getProducts = async (req, res) => {
  try {
    const userId = req.user._id;

    const products = await Product.find({ userId });

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
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/add-product", {
      docTitle: "Add Product",
      path: "/add-product",
      errorMessage: errors.array()[0].msg,
      oldInput: { ...req.body },
      validationErrors: errors.array(),
    });
  }

  const { title, price, description } = req.body;
  const image = req.file;

  if (!image) {
    return res.status(422).render("admin/add-product", {
      docTitle: "Add Product",
      path: "/add-product",
      errorMessage: "Attached file is not an image.",
      oldInput: { ...req.body },
      validationErrors: [],
    });
  }

  const imagePath = image.path.replace(/\\/g, "/");
  console.log(image);

  try {
    const product = new Product({
      title,
      price,
      description,
      image: imagePath,
      userId: req.user._id,
    });

    await product.save();

    console.log("Product created:", product);
    return res.status(201).redirect("/all-products");
  } catch (err) {
    console.error("Error saving product:", err);
    return res.status(500).json({ message: "Error saving product", error: err.message });
  }
};


// @ts-ignore
exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    docTitle: "Add Product",
    path: "/add-product",
    errorMessage: "",
    oldInput: {...req.body}
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
    console.log(product);
    // @ts-ignore
    console.log(product[0]._id);
    // @ts-ignore
    console.log(product[0]._id.toString());

    // @ts-ignore
    if (product[0]?.userId.toString() !== req.user._id.toString()) {
      return res.redirect("/all-products");
    }

    // Render the edit-product page with the fetched product
    res.render("admin/edit-product", {
      product,
      // @ts-ignore
      docTitle: `Edit ${product[0].title}`,
      path: `/edit-product/${productId}`,
      // @ts-ignore
      productId: product[0]._id.toString()
    });
  } catch (err) {
    console.error("Error fetching product for editing:", err);
    res.status(500).redirect("/all-products");
  }
};

exports.updateProduct = async (req, res) => {
  const errors = validationResult(req);
  const productId = req.params.productId;
  const image = req.file;

  if (!errors.isEmpty()) {
    const { title, price, description } = req.body;

    return res.status(422).render("admin/edit-product", {
      product: { _id: productId, title, price, description },
      docTitle: "Edit Product",
      path: `/edit-product/${productId}`,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  try {
    const { title, price, description } = req.body;

    const updatedData = {
      title,
      price,
      description,
    };

    if (image) {
      console.log("Uploaded file:", image); // Debug log
      updatedData.image = image.path.replace(/\\/g, "/");
    } else {
      console.log("No image uploaded.");
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updatedData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("Product updated:", updatedProduct);
    res.status(200).redirect("/all-products");
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ message: "Error updating product", error: err.message });
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