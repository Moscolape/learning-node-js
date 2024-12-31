const express = require("express");

const shopController = require("../controllers/shop");
const isProtected = require("../middleware/isProtected");

const router = express.Router();

// @ts-ignore
router.get("/", shopController.getIndex);

// @ts-ignore
router.get("/products", shopController.getAllProducts);

// @ts-ignore
router.get("/products/:id", shopController.getThisProduct);

// @ts-ignore
router.get("/carts", isProtected, shopController.getCart);

// @ts-ignore
router.post("/carts", shopController.addToCart);

// @ts-ignore
router.post("/remove-from-cart", shopController.removeCartItem);

// @ts-ignore
router.post("/create-order", shopController.postOrder);

// @ts-ignore
router.get("/orders", isProtected, shopController.getOrders);

// @ts-ignore
router.get("/checkout", shopController.getCheckout);

module.exports = router;