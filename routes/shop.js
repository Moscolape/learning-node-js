const express = require("express");

const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getAllProducts);

router.get("/products/:productId", shopController.getThisProduct);

router.get("/carts", shopController.getCart);

router.post("/carts", shopController.addToCart);

router.post("/update-cart", shopController.updateCart);

router.post("/remove-from-cart", shopController.removeFromCart);

router.get("/orders", shopController.getOrders);

router.get("/checkout", shopController.getCheckout);

module.exports = router;