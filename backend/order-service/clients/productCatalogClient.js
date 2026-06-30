const jwt = require('jsonwebtoken');
const { AppError } = require('shared-utils');
const { ApiErrors } = require('../errors/apiErrors');

const PRODUCT_CATALOG_URL = process.env.PRODUCT_CATALOG_SERVICE_URL || 'http://localhost:3003';

const getServiceToken = () => {
  if (!process.env.JWT_SECRET) {
    throw new AppError(ApiErrors.EXTERNAL_SERVICE_ERROR);
  }
  return jwt.sign(
    { id: 0, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

const handleResponse = async (response) => {
  if (response.ok) {
    if (response.status === 204) return null;
    return response.json();
  }

  if (response.status === 404) {
    throw new AppError(ApiErrors.INSUFFICIENT_STOCK);
  }

  throw new AppError(ApiErrors.EXTERNAL_SERVICE_ERROR);
};

class ProductCatalogClient {
  static async getVariant(variantId) {
    const id = Number(variantId);
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError(ApiErrors.VALIDATION_ERROR);
    }

    let response;
    try {
      response = await fetch(`${PRODUCT_CATALOG_URL}/api/variants/${id}`);
    } catch {
      throw new AppError(ApiErrors.EXTERNAL_SERVICE_ERROR);
    }

    return handleResponse(response);
  }

  static async updateStock(variantId, stockQuantity) {
    const response = await fetch(`${PRODUCT_CATALOG_URL}/api/variants/${variantId}/stock`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getServiceToken()}`
      },
      body: JSON.stringify({ stock_quantity: stockQuantity })
    });
    return handleResponse(response);
  }

  static async reserveStock(items) {
    const reserved = [];
    const updated = [];

    for (const item of items) {
      const variant = await this.getVariant(item.variant_id);
      if (variant.stock_quantity < item.quantity) {
        throw new AppError(ApiErrors.INSUFFICIENT_STOCK);
      }

      reserved.push({
        variant_id: variant.id,
        quantity: item.quantity,
        unit_price: Number(variant.product.price),
        product_name: variant.product.name,
        size: variant.size,
        color: variant.color,
        new_stock: variant.stock_quantity - item.quantity
      });
    }

    try {
      for (const item of reserved) {
        await this.updateStock(item.variant_id, item.new_stock);
        updated.push(item);
      }
    } catch (error) {
      for (const item of updated) {
        const variant = await this.getVariant(item.variant_id);
        await this.updateStock(item.variant_id, variant.stock_quantity + item.quantity).catch(() => {});
      }
      throw error;
    }

    return {
      items: reserved.map(({ new_stock, ...item }) => item)
    };
  }

  static async releaseStock(items) {
    for (const item of items) {
      const variant = await this.getVariant(item.variant_id);
      await this.updateStock(item.variant_id, variant.stock_quantity + item.quantity);
    }
  }
}

module.exports = ProductCatalogClient;
