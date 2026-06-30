const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Wariant produktu (kombinacja rozmiaru i koloru) ze stanem magazynowym.
 * Identyfikator wariantu (variant_id) jest używany w koszyku i zamówieniach.
 * Tabela: Variants
 */
const Variant = sequelize.define('Variant', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  product_id: {
    // Produkt nadrzędny (FK do Products)
    type: DataTypes.INTEGER,
    allowNull: false
  },
  size: {
    // Rozmiar, np. S, M, L
    type: DataTypes.STRING,
    allowNull: false
  },
  color: {
    // Kolor wariantu
    type: DataTypes.STRING,
    allowNull: false
  },
  stock_quantity: {
    // Dostępna ilość sztuk na magazynie (≥ 0)
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'Variants',
  timestamps: true
});

module.exports = Variant;
