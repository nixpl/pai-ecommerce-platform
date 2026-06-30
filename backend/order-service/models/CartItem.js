const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Pozycja w koszyku — wariant produktu i żądana ilość.
 * Tabela: CartItems
 */
const CartItem = sequelize.define('CartItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cart_id: {
    // Koszyk, do którego należy pozycja
    type: DataTypes.INTEGER,
    allowNull: false
  },
  variant_id: {
    // ID wariantu z Catalog Service (brak FK — osobna baza)
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    // Liczba sztuk (domyślnie 1)
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  tableName: 'CartItems',
  timestamps: true,
  indexes: [
    // Ten sam wariant nie może wystąpić dwukrotnie w jednym koszyku
    { unique: true, fields: ['cart_id', 'variant_id'] }
  ]
});

module.exports = CartItem;
