const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Kategoria produktów z obsługą drzewa (parent_id → podkategorie).
 * Tabela: Categories
 */
const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    // Nazwa kategorii
    type: DataTypes.STRING,
    allowNull: false
  },
  parent_id: {
    // ID kategorii nadrzędnej; null = kategoria korzenia
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'Categories',
  timestamps: true
});

module.exports = Category;
