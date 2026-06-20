const { sequelize, Order, OrderItem } = require('../models');
const { ORDER_STATUSES } = require('../models/Order');
const { AppError } = require('shared-utils');
const { ApiErrors } = require('../errors/apiErrors');
const CartService = require('./cartService');
const ProductCatalogClient = require('../clients/productCatalogClient');
const ProfileClient = require('../clients/profileClient');

const VALID_STATUS_TRANSITIONS = {
  NEW: ['PAID', 'CANCELLED'],
  PAID: ['SHIPPED', 'CANCELLED'],
  SHIPPED: [],
  CANCELLED: []
};

class OrderService {
  static async createOrder(userId, addressId, authToken) {
    if (!addressId || !Number.isInteger(Number(addressId))) {
      throw new AppError(ApiErrors.VALIDATION_ERROR);
    }

    const cart = await CartService.getCart(userId);
    if (!cart.items.length) {
      throw new AppError(ApiErrors.CART_EMPTY);
    }

    const address = await ProfileClient.getAddress(Number(addressId), authToken);

    const reserveItems = cart.items.map((item) => ({
      variant_id: item.variant_id,
      quantity: item.quantity
    }));

    let reservedItems;
    try {
      const reserveResult = await ProductCatalogClient.reserveStock(reserveItems);
      reservedItems = reserveResult.items;
    } catch (error) {
      throw error;
    }

    const transaction = await sequelize.transaction();

    try {
      const total = reservedItems.reduce(
        (sum, item) => sum + item.unit_price * item.quantity,
        0
      );

      const order = await Order.create({
        user_id: userId,
        status: 'NEW',
        total: total.toFixed(2),
        source_address_id: address.id,
        street: address.street,
        building_number: address.building_number,
        city: address.city,
        zip_code: address.zip_code,
        country: address.country
      }, { transaction });

      await OrderItem.bulkCreate(
        reservedItems.map((item) => ({
          order_id: order.id,
          variant_id: item.variant_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          product_name: item.product_name,
          size: item.size,
          color: item.color
        })),
        { transaction }
      );

      await CartService.clearCart(cart.id, transaction);
      await transaction.commit();

      return this.getOrderById(order.id, userId, false);
    } catch (error) {
      await transaction.rollback();
      await ProductCatalogClient.releaseStock(reserveItems).catch(() => {});
      throw error;
    }
  }

  static async listUserOrders(userId) {
    const orders = await Order.findAll({
      where: { user_id: userId },
      include: [{ model: OrderItem, as: 'items' }],
      order: [['createdAt', 'DESC']]
    });
    return orders;
  }

  static async listAllOrders() {
    const orders = await Order.findAll({
      include: [{ model: OrderItem, as: 'items' }],
      order: [['createdAt', 'DESC']]
    });
    return orders;
  }

  static async getOrderById(orderId, userId, isAdmin) {
    const order = await Order.findByPk(orderId, {
      include: [{ model: OrderItem, as: 'items' }]
    });

    if (!order) throw new AppError(ApiErrors.ORDER_NOT_FOUND);
    if (!isAdmin && order.user_id !== userId) {
      throw new AppError(ApiErrors.ORDER_NOT_FOUND);
    }

    return order;
  }

  static async updateOrderStatus(orderId, status) {
    if (!ORDER_STATUSES.includes(status)) {
      throw new AppError(ApiErrors.INVALID_ORDER_STATUS);
    }

    const order = await Order.findByPk(orderId, {
      include: [{ model: OrderItem, as: 'items' }]
    });
    if (!order) throw new AppError(ApiErrors.ORDER_NOT_FOUND);

    const allowed = VALID_STATUS_TRANSITIONS[order.status] || [];
    if (!allowed.includes(status)) {
      throw new AppError(ApiErrors.INVALID_ORDER_STATUS);
    }

    if (status === 'CANCELLED' && ['NEW', 'PAID'].includes(order.status)) {
      await ProductCatalogClient.releaseStock(
        order.items.map((item) => ({
          variant_id: item.variant_id,
          quantity: item.quantity
        }))
      );
    }

    await order.update({ status });
    return this.getOrderById(order.id, order.user_id, true);
  }
}

module.exports = OrderService;
