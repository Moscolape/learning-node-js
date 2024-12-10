// const Cart = require("../models/cart");
const Product = require("../models/products");

// @ts-ignore
exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    docTitle: "Add Product",
    path: "/add-product",
  });
};

// @ts-ignore
exports.editProduct = async (req, res, next) => {
  const productId = req.query.productId;

  if (!productId) {
    return res.redirect("/products");
  }

  try {
    // Use Sequelize's findByPk method to fetch the product by its primary key (ID)
    const product = await Product.findByPk(productId);

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

// @ts-ignore
exports.updateProduct = async (req, res) => {
  const { productId } = req.body;
  const updatedProductData = req.body;

  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    await product.update(updatedProductData);
    console.log("Product updated:", product);

    return res.redirect("/");
  } catch (err) {
    console.error("Error updating product:", err);
    return res.status(500).json({ message: "Error updating product", error: err.message });
  }
};


// @ts-ignore
exports.deleteProduct = async (req, res) => {
  const { productId } = req.body; 

  try {
    const result = await Product.destroy({ where: { id: productId } });
    if (result) {
      console.log(`Product with ID ${productId} deleted.`);
      return res.redirect("/");
    } else {
      console.log("Product not found.");
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    console.error("Error deleting product:", err);
    return res.status(500).json({ message: "Error deleting product", error: err.message });
  }
};


// @ts-ignore
exports.postAddProduct = async (req, res) => {
  try {
    const { title, imageUrl, price, description } = req.body;

    const product = await Product.create({
      title,
      imageUrl,
      price,
      description,
      UserId: req.user.id
    });

    console.log("Product created:", product);

    return res.status(201).redirect("/");
  } catch (err) {
    console.error("Error saving product:", err);
    return res
      .status(500)
      .json({ message: "Error saving product", error: err.message });
  }
};

// @ts-ignore
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();

    return res.render("admin/all-products", {
      products,
      docTitle: "All Products",
      path: "/all-products",
      hasProduct: products.length > 0
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    return res.status(500).json({ message: "Error fetching products" });
  }
};
