const mongoose = require("mongoose");

async function connectToMongoDB() {
  try {
    await mongoose.connect("mongodb+srv://Moscolian:ilovedherin2019@cluster0.cz0tz.mongodb.net/shop", {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    throw err;
  }
}

module.exports = { connectToMongoDB };