const CartService = require('../services/cartService');

const getCart = async (req, res, next) => {
  try {
    const cart = await CartService.getCart(req.account.id);
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

const addItem = async (req, res, next) => {
  try {
    const { variant_id: variantId, quantity } = req.body;
    const cart = await CartService.addItem(req.account.id, Number(variantId), quantity !== undefined ? Number(quantity) : 1);
    res.status(201).json(cart);
  } catch (error) {
    next(error);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const cart = await CartService.updateItemQuantity(
      req.account.id,
      parseInt(req.params.variantId, 10),
      Number(req.body.quantity)
    );
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

const removeItem = async (req, res, next) => {
  try {
    const cart = await CartService.removeItem(req.account.id, parseInt(req.params.variantId, 10));
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addItem, updateItem, removeItem };
