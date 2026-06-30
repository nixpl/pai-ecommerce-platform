const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Adres dostawy przypisany do profilu użytkownika.
 * Używany przy składaniu zamówienia (Order Service pobiera dane przez API).
 * Tabela: Addresses
 */
const Address = sequelize.define('Address', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  profile_id: {
    // Właściciel adresu (FK logiczne do Profiles w tej samej bazie)
    type: DataTypes.INTEGER,
    allowNull: false
  },
  street: {
    // Ulica
    type: DataTypes.STRING,
    allowNull: false
  },
  building_number: {
    // Numer budynku / lokalu
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    // Miasto
    type: DataTypes.STRING,
    allowNull: false
  },
  zip_code: {
    // Kod pocztowy (format 12-345 lub 12345)
    type: DataTypes.STRING,
    allowNull: false
  },
  country: {
    // Kraj
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'Addresses',
  timestamps: true
});

module.exports = Address;
