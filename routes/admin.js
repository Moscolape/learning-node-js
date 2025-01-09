const express = require("express");
const { check, body } = require("express-validator");

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
router.post(
  "/edit-product/:productId",
  isProtected,
  [
    body("title")
      .isString()
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 characters long."),
    // body("imageUrl")
    //   .isURL()
    //   .withMessage("Please provide a valid URL for the image."),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be a number greater than 0."),
    body("description")
      .isLength({ min: 5 })
      .withMessage("Description must be at least 5 characters long."),
  ],
  adminController.updateProduct
);

// @ts-ignore
// router.post("/delete-product", adminController.deleteProduct);
router.delete("/delete-product/:productId", isProtected, adminController.deleteProduct);

// @ts-ignore
router.post(
  "/add-product",
  isProtected,
  [
    check("title")
      .isString()
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 characters long."),
    // check("imageUrl")
    //   .isURL()
    //   .withMessage("Please provide a valid URL for the image."),
    check("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be a number greater than 0."),
    check("description")
      .isLength({ min: 5 })
      .withMessage("Description must be at least 5 characters long."),
  ],
  adminController.postAddProduct
);

module.exports = router;