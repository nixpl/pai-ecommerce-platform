const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Zamówienie złożone przez użytkownika.
 * Adres dostawy jest zapisany jako snapshot (pola street…country),
 * aby zmiana adresu w profilu nie wpływała na historyczne zamówienia.
 * Tabela: Orders
 */
const ORDER_STATUSES = ['NEW', 'PAID', 'SHIPPED', 'CANCELLED'];
// NEW → PAID/SHIPPED/CANCELLED zgodnie z regułami w OrderService

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    // ID konta z Auth Service
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    // Aktualny etap realizacji zamówienia
    type: DataTypes.ENUM(...ORDER_STATUSES),
    allowNull: false,
    defaultValue: 'NEW'
  },
  total: {
    // Suma zamówienia w PLN (DECIMAL 10,2), wyliczona przy składaniu
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  source_address_id: {
    // ID adresu z Profile Service w momencie składania zamówienia
    type: DataTypes.INTEGER,
    allowNull: false
  },
  street: {
    // Snapshot: ulica z adresu dostawy
    type: DataTypes.STRING,
    allowNull: false
  },
  building_number: {
    // Snapshot: nr budynku
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    // Snapshot: miasto
    type: DataTypes.STRING,
    allowNull: false
  },
  zip_code: {
    // Snapshot: kod pocztowy
    type: DataTypes.STRING,
    allowNull: false
  },
  country: {
    // Snapshot: kraj
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'Orders',
  timestamps: true
});

module.exports = Order;
module.exports.ORDER_STATUSES = ORDER_STATUSES;
