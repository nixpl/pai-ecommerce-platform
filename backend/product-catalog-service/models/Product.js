const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Produkt w katalogu sklepu.
 * Cena bazowa produktu; warianty (rozmiar/kolor) mają własny stan magazynowy.
 * Tabela: Products
 */
const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    // Nazwa produktu
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    // Opis marketingowy (opcjonalny)
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    // Cena jednostkowa w PLN (DECIMAL 10,2)
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  category_id: {
    // Kategoria nadrzędna (opcjonalna; FK do Categories)
    type: DataTypes.INTEGER,
    allowNull: true
  },
  images: {
    // Tablica URL-i obrazków produktu (JSON)
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  }
}, {
  tableName: 'Products',
  timestamps: true
});

module.exports = Product;
