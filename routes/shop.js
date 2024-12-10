const express = require("express");

const shopController = require("../controllers/shop");

const router = express.Router();

// @ts-ignore
router.get("/", shopController.getIndex);

// @ts-ignore
router.get("/products", shopController.getAllProducts);

// @ts-ignore
router.get("/products/:id", shopController.getThisProduct);

// @ts-ignore
router.get("/carts", shopController.getCart);

// @ts-ignore
router.post("/carts", shopController.addToCart);

// @ts-ignore
router.post("/update-cart", shopController.updateCart);

// @ts-ignore
router.post("/remove-from-cart", shopController.removeFromCart);

// @ts-ignore
router.get("/orders", shopController.getOrders);

// @ts-ignore
router.get("/checkout", shopController.getCheckout);

module.exports = router;