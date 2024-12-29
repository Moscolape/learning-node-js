const Sequelize = require("sequelize");
const sequelize = require("../../utils/database");
// const Cart = require('./cart');

const CartItem = sequelize.define("CartItem", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  qty: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  // price: {
  //   type: Sequelize.FLOAT,
  //   allowNull: false,
  // },
});

module.exports = CartItem;
