const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
});

// Custom method to get or create a cart

// @ts-ignore
User.prototype.getCart = async function () {
  // @ts-ignore
  let cart = await this.getCarts(); // Sequelize's auto-generated method
  if (!cart.length) {
    // @ts-ignore
    cart = await this.createCart(); // Create a cart if none exists
  } else {
    cart = cart[0]; // Use the first cart if one already exists
  }
  return cart;
};

module.exports = User;