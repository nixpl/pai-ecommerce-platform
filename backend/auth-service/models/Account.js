const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Konto użytkownika w serwisie autentykacji.
 * Przechowuje dane logowania i rolę używana w tokenie JWT.
 * Tabela: Accounts
 */
const Account = sequelize.define('Account', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    // Adres e-mail — unikalny identyfikator logowania
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password_hash: {
    // Hash hasła (bcrypt); surowe hasło nigdy nie jest zapisywane
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    // Uprawnienia: client (domyślna), admin, super_admin
    type: DataTypes.ENUM('client', 'admin', 'super_admin'),
    allowNull: false,
    defaultValue: 'client'
  }
}, {
  tableName: 'Accounts',
  timestamps: true
});

module.exports = Account;
