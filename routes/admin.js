const express = require("express");

const adminController = require("../controllers/admin");
const router = express.Router();

router.get("/add-product", adminController.getAddProduct);

router.get("/edit-product", adminController.editProduct);

router.post('/edit-product', adminController.updateProduct);

router.post("/delete-product", adminController.deleteProduct);

router.get("/all-products", adminController.getProducts);

router.post("/add-product", adminController.postAddProduct);

module.exports = router;
