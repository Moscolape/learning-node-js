const mongoose = require("mongoose");
const Order = require("./order");
const Schema = mongoose.Schema;

// Define the User schema
const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

// Add to cart method
userSchema.methods.addToCart = function (product) {
  if (!this.cart) {
    this.cart = { items: [] };
  }

  const cartProductIndex = this.cart.items.findIndex(
    // @ts-ignore
    (cp) => cp.productId.toString() === product[0]._id.toString()
  );

  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    // @ts-ignore
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product[0]._id,  // Ensure productId is passed correctly
      quantity: newQuantity,
    });
  }

  // @ts-ignore
  this.cart.items = updatedCartItems;
  // @ts-ignore
  return this.save();
};

// Get cart method
userSchema.methods.getCart = async function () {
  const productIds = this.cart.items.map((item) => item.productId);

  const products = await mongoose
    .model("Product")
    .find({ _id: { $in: productIds } });

  return this.cart.items.map((cartItem) => {
    const product = products.find(
      (p) => p._id.toString() === cartItem.productId.toString()
    );
    return {
      ...product._doc,
      quantity: cartItem.quantity,
    };
  });
};

// Remove from cart method
userSchema.methods.removeFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter(
    (item) => item.productId.toString() !== productId.toString()
  );

  this.cart.items = updatedCartItems;
  return this.save();
};

// Add order method
userSchema.methods.addOrder = async function () {
  // @ts-ignore
  const cartProducts = await this.getCart();

  const order = new (mongoose.model("Order"))({
    items: cartProducts.map(cartProduct => ({
      productId: cartProduct._id,
      title: cartProduct.title,
      quantity: cartProduct.quantity,
      price: cartProduct.price,
    })),
    user: {
      // @ts-ignore
      _id: this._id,
      // @ts-ignore
      email: this.email,
    },
  });

  // Save the order
  await order.save();

  this.cart = { items: [] };
  // @ts-ignore
  return this.save();
};


// Get orders method
userSchema.methods.getOrders = function () {
  return Order.find({ "user._id": this._id });
};

// Create and export the User model
module.exports = mongoose.model("User", userSchema);