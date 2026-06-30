const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Pozycja zamówienia — snapshot danych produktu z momentu zakupu.
 * Cena i nazwa są zamrożone, aby historia zamówień była spójna
 * nawet po zmianie ceny lub nazwy w katalogu.
 * Tabela: OrderItems
 */
const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_id: {
    // Zamówienie nadrzędne
    type: DataTypes.INTEGER,
    allowNull: false
  },
  variant_id: {
    // ID wariantu z Catalog Service (referencja informacyjna)
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    // Zamówiona ilość sztuk
    type: DataTypes.INTEGER,
    allowNull: false
  },
  unit_price: {
    // Cena jednostkowa w momencie zakupu (DECIMAL 10,2)
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  product_name: {
    // Nazwa produktu w momencie zakupu
    type: DataTypes.STRING,
    allowNull: false
  },
  size: {
    // Rozmiar wariantu w momencie zakupu
    type: DataTypes.STRING,
    allowNull: false
  },
  color: {
    // Kolor wariantu w momencie zakupu
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'OrderItems',
  timestamps: true
});

module.exports = OrderItem;
