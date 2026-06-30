const sequelize = require('../config/database');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// Koszyk → pozycje; usunięcie koszyka kasuje pozycje (CASCADE)
Cart.hasMany(CartItem, { foreignKey: 'cart_id', as: 'items', onDelete: 'CASCADE', hooks: true });
CartItem.belongsTo(Cart, { foreignKey: 'cart_id', as: 'cart' });

// Zamówienie → pozycje; usunięcie zamówienia kasuje pozycje (CASCADE)
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items', onDelete: 'CASCADE', hooks: true });
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

module.exports = {
  sequelize,
  Cart,
  CartItem,
  Order,
  OrderItem
};
