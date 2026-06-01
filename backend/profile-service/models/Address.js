const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Address = sequelize.define('Address', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  profile_id: {
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
  tableName: 'Addresses',
  timestamps: true
});

module.exports = Address;
