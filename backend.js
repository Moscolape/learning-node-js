const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const errorController = require("./controllers/error");

const sequelize = require("./utils/database");

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoute = require("./routes/admin");
const shopRoute = require("./routes/shop");

const Product = require("./models/products");
const User = require("./models/user");
const CartItem = require("./models/cart-item");
const Cart = require("./models/cart");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      // @ts-ignore
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use(adminRoute);
app.use(shopRoute);

app.use(errorController.get404);

// define relations
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});

sequelize
  // .sync({force: true})
  .sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      User.create({ name: "Moses", email: "moscolian@gmail.com" });
    }
    return user;
  })
  .then(user => {
    // @ts-ignore
    return user.createCart();
  })
  .then((cart) => {
    console.log(cart);
    app.listen(4000);
  })
  .catch((err) => console.log(err));
