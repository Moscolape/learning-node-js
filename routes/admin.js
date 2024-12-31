const express = require("express");

const adminController = require("../controllers/admin");
const isProtected = require("../middleware/isProtected");

const router = express.Router();

// @ts-ignore
router.get("/add-product", isProtected, adminController.getAddProduct);

// @ts-ignore
router.get("/edit-product/:productId", isProtected, adminController.editProduct);

// @ts-ignore
router.get("/all-products", isProtected, adminController.getProducts);

// @ts-ignore
router.post('/edit-product/:productId', adminController.updateProduct);

// @ts-ignore
router.post("/delete-product", adminController.deleteProduct);

// @ts-ignore
router.post("/add-product", adminController.postAddProduct);

module.exports = router;
