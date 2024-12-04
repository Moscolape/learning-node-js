const fs = require("fs");
const path = require("path");

const rootDir = require("../utils/usePath");

module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  static getFilePath() {
    return path.join(rootDir, "data", "products.json");
  }

  static async readFile() {
    try {
      const fileContent = await fs.promises.readFile(this.getFilePath());
      return JSON.parse(fileContent.toString());
    } catch {
      return [];
    }
  }

  static async writeFile(data) {
    try {
      await fs.promises.writeFile(this.getFilePath(), JSON.stringify(data));
    } catch (err) {
      console.error("Error writing file:", err);
    }
  }

  async save() {
    this.id = Math.random().toString();
    const products = await Product.readFile();
    products.push(this);
    await Product.writeFile(products);
  }

  static fetchAll() {
    return this.readFile();
  }

  static async findById(id) {
    const products = await Product.readFile();
    return products.find(product => product.id === id);
  }
};
