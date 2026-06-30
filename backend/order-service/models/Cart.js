const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Koszyk zakupów użytkownika.
 * Jeden koszyk na użytkownika (user_id unikalne).
 * Tabela: Carts
 */
const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    // ID konta z Auth Service (brak FK — osobna baza)
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'Carts',
  timestamps: true
});

module.exports = Cart;
