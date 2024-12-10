// Using Sequelize
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'ilovedherin2019=M', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;