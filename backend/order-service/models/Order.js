const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ORDER_STATUSES = ['NEW', 'PAID', 'SHIPPED', 'CANCELLED'];

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM(...ORDER_STATUSES),
    allowNull: false,
    defaultValue: 'NEW'
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  source_address_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  street: {
    type: DataTypes.STRING,
    allowNull: false
  },
  building_number: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  zip_code: {
    type: DataTypes.STRING,
    allowNull: false
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'Orders',
  timestamps: true
});

module.exports = Order;
module.exports.ORDER_STATUSES = ORDER_STATUSES;
