const express = require('express');
const path = require('path');

const router = express.Router();
// const rootDir  = require('../utils/usePath');

const adminData = require("./admin");

router.get("/", (req, res, next) => {
  const products = adminData.products;
  res.render('shop', {prods: products, docTitle: 'Shop', path: '/'})
  // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
});

module.exports = router;