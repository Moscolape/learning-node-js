// const db = require("../utils/database");

// module.exports = class Product {
//   constructor(title, imageUrl, description, price) {
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//   }

//   // Save a new product
//   async save() {
//     try {
//       const query = `
//         INSERT INTO products (title, price, description, imageUrl) 
//         VALUES (?, ?, ?, ?)
//       `;
//       const values = [this.title, this.price, this.description, this.imageUrl];
//       await db.execute(query, values);
//     } catch (err) {
//       console.error("Error saving product:", err);
//       throw err;
//     }
//   }

//   // Fetch all products
//   static async fetchAll() {
//     try {
//       const [rows] = await db.execute("SELECT * FROM products");
//       return rows;
//     } catch (err) {
//       console.error("Error fetching products:", err);
//       throw err;
//     }
//   }

//   // Find a product by ID
//   static async findById(id) {
//     try {
//       const [rows] = await db.execute("SELECT * FROM products WHERE id = ?", [id]);
//       // @ts-ignore
//       return rows.length ? rows[0] : null;
//     } catch (err) {
//       console.error("Error finding product:", err);
//       throw err;
//     }
//   }  

//   // Update an existing product
//   static async update(productId, updatedProductData) {
//     try {
//       const { title, price, description, imageUrl } = updatedProductData;
//       const query = `
//         UPDATE products 
//         SET title = ?, price = ?, description = ?, imageUrl = ? 
//         WHERE id = ?
//       `;
//       const values = [title, price, description, imageUrl, productId];
//       await db.execute(query, values);
//     } catch (err) {
//       console.error("Error updating product:", err);
//       throw err;
//     }
//   }

//   // Delete a product
//   static async deleteById(productId) {
//     try {
//       await db.execute("DELETE FROM products WHERE id = ?", [productId]);
//     } catch (err) {
//       console.error("Error deleting product:", err);
//       throw err;
//     }
//   }
// };
