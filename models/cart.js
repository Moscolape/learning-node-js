const fs = require("fs");
const path = require("path");

const rootDir = require("../utils/usePath");

class Cart {
  static getFilePath() {
    return path.join(rootDir, "data", "cart.json");
  }

  static async readCart() {
    try {
      const fileContent = await fs.promises.readFile(this.getFilePath());
      return JSON.parse(fileContent.toString());
    } catch {
      return { products: [], totalPrice: 0 };
    }
  }

  static async writeCart(data) {
    await fs.promises.writeFile(this.getFilePath(), JSON.stringify(data));
  }

  static async addProduct(id, price, action = "increase") {
    const cart = await this.readCart();
    const existingProductIndex = cart.products.findIndex(
      (prod) => prod.id === id
    );
    const existingProduct = cart.products[existingProductIndex];

    if (existingProduct) {
      if (action === "increase") {
        existingProduct.qty++;
      } else if (action === "decrease" && existingProduct.qty > 1) {
        existingProduct.qty--;
      } else if (action === "decrease" && existingProduct.qty === 1) {
        cart.products.splice(existingProductIndex, 1);
      }
    } else {
      cart.products.push({ id, qty: 1, price });
    }

    cart.totalPrice = cart.products.reduce((total, product) => {
      return total + product.price * product.qty;
    }, 0);

    await this.writeCart(cart);
  }

  static async getCart() {
    return await this.readCart();
  }

  static async removeProduct(productId) {
    const cart = await this.readCart();
    const product = cart.products.find((prod) => prod.id === productId);

    if (!product) return;

    cart.totalPrice -= product.qty * product.price;
    cart.products = cart.products.filter((prod) => prod.id !== productId);

    await this.writeCart(cart);
  }
}

module.exports = Cart;
