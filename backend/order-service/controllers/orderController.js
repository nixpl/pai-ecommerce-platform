const OrderService = require('../services/orderService');

const createOrder = async (req, res, next) => {
  try {
    const authToken = req.headers.authorization.split(' ')[1];
    const order = await OrderService.createOrder(
      req.account.id,
      Number(req.body.address_id),
      authToken
    );
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

const listMyOrders = async (req, res, next) => {
  try {
    const orders = await OrderService.listUserOrders(req.account.id);
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const listAllOrders = async (req, res, next) => {
  try {
    const orders = await OrderService.listAllOrders();
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const getOrder = async (req, res, next) => {
  try {
    const isAdmin = ['admin', 'super_admin'].includes(req.account.role);
    const order = await OrderService.getOrderById(
      parseInt(req.params.id, 10),
      req.account.id,
      isAdmin
    );
    res.json(order);
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const order = await OrderService.updateOrderStatus(
      parseInt(req.params.id, 10),
      req.body.status
    );
    res.json(order);
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, listMyOrders, listAllOrders, getOrder, updateStatus };
