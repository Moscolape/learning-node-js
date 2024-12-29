const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Order schema
const orderSchema = new Schema({
  items: [
    {
      productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
      title: { type: String, required: true },  // Optional, but good to include if you need the price in the order
      price: { type: Number, required: true },  // Optional, but good to include if you need the price in the order
    }
  ],
  user: {
    _id: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String },
  },
});


// Create and export the Order model
module.exports = mongoose.model("Order", orderSchema);
