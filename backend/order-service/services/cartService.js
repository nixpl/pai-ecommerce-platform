const { Cart, CartItem } = require('../models');
const { AppError, ValidationErrorDetail, ValidationErrors } = require('shared-utils');
const { ApiErrors } = require('../errors/apiErrors');
const ProductCatalogClient = require('../clients/productCatalogClient');

const validateQuantity = (quantity) => {
  const num = Number(quantity);
  if (!Number.isInteger(num) || num < 1) {
    return new ValidationErrorDetail(ValidationErrors.INVALID_FORMAT, 'quantity', { format: 'liczba całkowita większa od 0' });
  }
  return null;
};

const getOrCreateCart = async (userId) => {
  const [cart] = await Cart.findOrCreate({ where: { user_id: userId } });
  return cart;
};

const buildCartResponse = async (cart) => {
  const items = await CartItem.findAll({ where: { cart_id: cart.id } });
  const enrichedItems = [];
  let total = 0;

  for (const item of items) {
    const variant = await ProductCatalogClient.getVariant(item.variant_id);
    const unitPrice = Number(variant.product.price);
    const lineTotal = unitPrice * item.quantity;
    total += lineTotal;

    enrichedItems.push({
      id: item.id,
      variant_id: item.variant_id,
      quantity: item.quantity,
      unit_price: unitPrice,
      line_total: lineTotal,
      product_name: variant.product.name,
      size: variant.size,
      color: variant.color,
      stock_quantity: variant.stock_quantity
    });
  }

  return {
    id: cart.id,
    user_id: cart.user_id,
    items: enrichedItems,
    total: Number(total.toFixed(2))
  };
};

class CartService {
  static async getCart(userId) {
    const cart = await getOrCreateCart(userId);
    return buildCartResponse(cart);
  }

  static async addItem(userId, variantId, quantity = 1) {
    const variantNum = Number(variantId);
    if (!Number.isInteger(variantNum) || variantNum <= 0) {
      throw new AppError(ApiErrors.VALIDATION_ERROR);
    }

    const qtyErr = validateQuantity(quantity);
    if (qtyErr) throw new AppError(ApiErrors.VALIDATION_ERROR, [qtyErr]);

    await ProductCatalogClient.getVariant(variantNum);

    const cart = await getOrCreateCart(userId);
    const existing = await CartItem.findOne({ where: { cart_id: cart.id, variant_id: variantNum } });

    if (existing) {
      await existing.update({ quantity: existing.quantity + quantity });
    } else {
      await CartItem.create({ cart_id: cart.id, variant_id: variantNum, quantity });
    }

    return buildCartResponse(cart);
  }

  static async updateItemQuantity(userId, variantId, quantity) {
    const qtyErr = validateQuantity(quantity);
    if (qtyErr) throw new AppError(ApiErrors.VALIDATION_ERROR, [qtyErr]);

    const cart = await getOrCreateCart(userId);
    const item = await CartItem.findOne({ where: { cart_id: cart.id, variant_id: variantId } });
    if (!item) throw new AppError(ApiErrors.CART_ITEM_NOT_FOUND);

    await item.update({ quantity });
    return buildCartResponse(cart);
  }

  static async removeItem(userId, variantId) {
    const cart = await getOrCreateCart(userId);
    const item = await CartItem.findOne({ where: { cart_id: cart.id, variant_id: variantId } });
    if (!item) throw new AppError(ApiErrors.CART_ITEM_NOT_FOUND);

    await item.destroy();
    return buildCartResponse(cart);
  }

  static async clearCart(cartId, transaction = null) {
    await CartItem.destroy({ where: { cart_id: cartId }, transaction });
  }
}

module.exports = CartService;
