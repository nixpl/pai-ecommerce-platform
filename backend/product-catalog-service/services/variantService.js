const { Product, Variant } = require('../models');
const {
  AppError,
  ValidationErrorDetail,
  ValidationErrors,
  validateRequired
} = require('shared-utils');
const { ApiErrors } = require('../errors/apiErrors');

const validateStock = (value, fieldName = 'stock_quantity') => {
  const num = Number(value);
  if (value === '' || value === null || value === undefined || !Number.isInteger(num) || num < 0) {
    return new ValidationErrorDetail(ValidationErrors.INVALID_FORMAT, fieldName, { format: 'liczba całkowita nieujemna' });
  }
  return null;
};

class VariantService {
  static async createVariant(productId, data = {}) {
    const product = await Product.findByPk(productId);
    if (!product) throw new AppError(ApiErrors.PRODUCT_NOT_FOUND);

    const details = [];
    const sizeErr = validateRequired(data.size, 'size', 1, 50);
    if (sizeErr) details.push(sizeErr);
    const colorErr = validateRequired(data.color, 'color', 1, 50);
    if (colorErr) details.push(colorErr);
    if (data.stock_quantity !== undefined) {
      const stockErr = validateStock(data.stock_quantity);
      if (stockErr) details.push(stockErr);
    }
    if (details.length > 0) throw new AppError(ApiErrors.VALIDATION_ERROR, details);

    const variant = await Variant.create({
      product_id: product.id,
      size: data.size,
      color: data.color,
      stock_quantity: data.stock_quantity !== undefined ? data.stock_quantity : 0
    });

    return variant;
  }

  static async updateVariant(id, data = {}) {
    const variant = await Variant.findByPk(id);
    if (!variant) throw new AppError(ApiErrors.VARIANT_NOT_FOUND);

    const details = [];
    if (data.size !== undefined) {
      const sizeErr = validateRequired(data.size, 'size', 1, 50);
      if (sizeErr) details.push(sizeErr);
    }
    if (data.color !== undefined) {
      const colorErr = validateRequired(data.color, 'color', 1, 50);
      if (colorErr) details.push(colorErr);
    }
    if (data.stock_quantity !== undefined) {
      const stockErr = validateStock(data.stock_quantity);
      if (stockErr) details.push(stockErr);
    }
    if (details.length > 0) throw new AppError(ApiErrors.VALIDATION_ERROR, details);

    const updates = {};
    if (data.size !== undefined) updates.size = data.size;
    if (data.color !== undefined) updates.color = data.color;
    if (data.stock_quantity !== undefined) updates.stock_quantity = data.stock_quantity;

    await variant.update(updates);
    return variant;
  }

  static async updateStock(id, stockQuantity) {
    const variant = await Variant.findByPk(id);
    if (!variant) throw new AppError(ApiErrors.VARIANT_NOT_FOUND);

    const stockErr = validateStock(stockQuantity);
    if (stockErr) throw new AppError(ApiErrors.VALIDATION_ERROR, [stockErr]);

    await variant.update({ stock_quantity: stockQuantity });
    return variant;
  }

  static async deleteVariant(id) {
    const variant = await Variant.findByPk(id);
    if (!variant) throw new AppError(ApiErrors.VARIANT_NOT_FOUND);
    await variant.destroy();
  }
}

module.exports = VariantService;
