const mongoose = require("mongoose");

// Define the Product schema
const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

// Static methods for the Product model
productSchema.statics.fetchAll = function () {
  // @ts-ignore
  return this.find().exec();
};

productSchema.statics.findById = function(id) {
  // @ts-ignore
  return this.find({ _id: id });
};

// productSchema.statics.findByIdAndDelete = function (prodId) {
//   // @ts-ignore
//   return this.findByIdAndDelete(prodId).exec();
// };

// productSchema.statics.findByIdAndUpdate = function (prodId, updatedData) {
//   // @ts-ignore
//   return this.findByIdAndUpdate(prodId, updatedData).exec();
// };

// Create and export the Product model
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
