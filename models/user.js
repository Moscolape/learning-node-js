// @ts-nocheck
const { ObjectId } = require("mongodb");
const { getDb } = require("../utils/mongodb");

class User {
  constructor(name, email, id, cart = { items: [] }) {
    this.name = name;
    this.email = email;
    this._id = id ? new ObjectId(id) : null;
    this.cart = cart;
  }

  // Save a new user or update an existing one
  save() {
    const db = getDb();
    if (this._id) {
      // Update the user if the ID exists
      return db
        .collection("users")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      // Insert a new user
      return db.collection("users").insertOne(this);
    }
  }

  // Fetch all users
  static fetchAll() {
    const db = getDb();
    return db.collection("users").find().toArray();
  }

  // Find a user by ID
  static findById(userId) {
    const db = getDb();
    return db.collection("users").findOne({ _id: new ObjectId(userId) });
  }

  // Delete a user by ID
  static deleteById(userId) {
    const db = getDb();
    return db.collection("users").deleteOne({ _id: new ObjectId(userId) });
  }

  addToCart(product) {
    if (!this.cart) {
      this.cart = { items: [] };
    }

    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId?.toString() === product._id?.toString();
    });

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity,
      });
    }

    const updatedCart = { items: updatedCartItems };

    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  async getCart() {
    if (!this._id) throw new Error("User ID is required to fetch the cart.");

    const db = getDb();
    const user = await db.collection("users").findOne({ _id: this._id });

    if (!user || !user.cart) {
      return { items: [] };
    }

    const cartItems = user.cart.items || [];
    const productIds = cartItems.map((item) => item.productId);

    const products = await db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray();

    const cartWithProducts = cartItems.map((cartItem) => {
      const product = products.find(
        (p) => p._id.toString() === cartItem.productId.toString()
      );
      return {
        ...product,
        qty: cartItem.quantity,
      };
    });

    return cartWithProducts;
  }

  async removeFromCart(productId) {
    try {
      const db = getDb();

      const updatedCartItems = this.cart.items.filter(
        (item) => item.productId.toString() !== productId.toString()
      );

      await db
        .collection("users")
        .updateOne(
          { _id: this._id },
          { $set: { cart: { items: updatedCartItems } } }
        );
    } catch (err) {
      console.error("Error in removeFromCart method:", err);
      throw err;
    }
  }

  addOrder() {
    const db = getDb();
    return this.getCart()
      .then((products) => {
        const order = {
          items: products,
          user: {
            _id: new ObjectId(this._id),
            name: this.name,
          },
        };
        return db.collection("orders").insertOne(order);
      })
      .then((result) => {
        this.cart = { items: [] };
        return db
          .collection("users")
          .updateOne(
            { _id: new ObjectId(this._id) },
            { $set: { cart: { items: [] } } }
          );
      });
  }

  // getOrders() {
  //   const db = getDB();
  //   // return db.collection('orders').
  // }

  async getOrders() {
    if (!this._id) throw new Error("User ID is required to fetch orders.");

    const db = getDb();
    return db
      .collection("orders")
      .find({ "user._id": new ObjectId(this._id) })
      .toArray();
  }
}

module.exports = User;
