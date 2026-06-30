const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Profil klienta powiązany z kontem z Auth Service.
 * Jeden profil na jedno konto (account_id unikalne).
 * Tabela: Profiles
 */
const Profile = sequelize.define('Profile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  account_id: {
    // ID konta z Auth Service (brak FK — osobna baza mikroserwisu)
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  first_name: {
    // Imię
    type: DataTypes.STRING,
    allowNull: false
  },
  last_name: {
    // Nazwisko
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    // Numer telefonu (tylko cyfry, walidacja w serwisie)
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'Profiles',
  timestamps: true
});

module.exports = Profile;
