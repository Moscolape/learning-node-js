const Sequelize = require("sequelize");
const sequelize = require("../../utils/database");

const Cart = sequelize.define("Cart", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  // totalPrice: {
  //   type: Sequelize.FLOAT,
  //   defaultValue: 0,
  // },
});

module.exports = Cart;
