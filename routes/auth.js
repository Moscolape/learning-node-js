const express = require("express");
const { check } = require("express-validator");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.get("/forgotten-password", authController.getReset);

router.get("/reset-password/:token", authController.getChangePassword);

router.post("/reset-password/:token", authController.postChangePassword);

router.post("/forgotten-password", authController.postReset);

router.post("/login", authController.postLogin);

router.post(
  "/signup",
  check("email").isEmail().withMessage("Please enter a valid email!"),
  authController.postSignup
);

router.post("/logout", authController.postLogout);

module.exports = router;