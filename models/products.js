const { ObjectId } = require("mongodb");
const { getDb } = require("../utils/mongodb");

class Product {
  constructor(title, price, description, imageUrl, id) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    // @ts-ignore
    this._id = id ? new require("mongodb").ObjectId(id) : null;
  }

  save() {
    const db = getDb();
    if (this._id) {
      // Update existing product
      return db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      // Insert new product
      return db.collection("products").insertOne(this);
    }
  }

  static fetchAll() {
    const db = getDb();
    return db.collection("products").find().toArray();
  }

  static findById(prodId) {
    const db = getDb();
    console.log(prodId);
    return db
      .collection("products")
      .findOne({ _id: new ObjectId(prodId) });
  }

  static deleteById(prodId) {
    const db = getDb();
    return db
      .collection("products")
      // @ts-ignore
      .deleteOne({ _id: new ObjectId(prodId) });
  }

  // Update product by id
  static updateById(prodId, updatedData) {
    const db = getDb();
    return db
      .collection("products")
      .updateOne(
        { _id: new ObjectId(prodId) },
        { $set: updatedData }
      );
  }
}

module.exports = Product;