const express = require("express");

const adminController = require("../controllers/admin");

const router = express.Router();

// @ts-ignore
router.get("/add-product", adminController.getAddProduct);

// @ts-ignore
router.get("/edit-product", adminController.editProduct);

// @ts-ignore
router.post('/edit-product/:id', adminController.updateProduct);

// @ts-ignore
router.post("/delete-product", adminController.deleteProduct);

// @ts-ignore
router.get("/all-products", adminController.getProducts);

// @ts-ignore
router.post("/add-product", adminController.postAddProduct);

module.exports = router;
