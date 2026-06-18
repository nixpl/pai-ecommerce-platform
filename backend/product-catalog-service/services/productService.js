const { Op } = require('sequelize');
const { Product, Category, Variant } = require('../models');
const {
  AppError,
  ValidationErrorDetail,
  ValidationErrors,
  validateRequired
} = require('shared-utils');
const { ApiErrors } = require('../errors/apiErrors');

const validatePrice = (value, fieldName) => {
  const num = Number(value);
  if (value === '' || value === null || value === undefined || Number.isNaN(num) || num < 0) {
    return new ValidationErrorDetail(ValidationErrors.INVALID_FORMAT, fieldName, { format: 'liczba nieujemna' });
  }
  return null;
};

const normalizeImages = (images) => {
  if (Array.isArray(images)) return images;
  if (images && typeof images === 'object') return Object.values(images);
  return [];
};

class ProductService {
  static async listProducts(query = {}) {
    const where = {};
    const variantWhere = {};

    if (query.category !== undefined && query.category !== '') {
      where.category_id = query.category;
    }

    if (query.search !== undefined && query.search !== '') {
      where.name = { [Op.like]: `%${query.search}%` };
    }

    const priceFilter = {};
    if (query.priceMin !== undefined && query.priceMin !== '') {
      priceFilter[Op.gte] = Number(query.priceMin);
    }
    if (query.priceMax !== undefined && query.priceMax !== '') {
      priceFilter[Op.lte] = Number(query.priceMax);
    }
    if (Object.getOwnPropertySymbols(priceFilter).length > 0) {
      where.price = priceFilter;
    }

    if (query.size !== undefined && query.size !== '') {
      variantWhere.size = query.size;
    }
    if (query.color !== undefined && query.color !== '') {
      variantWhere.color = query.color;
    }

    const filterByVariant = Object.keys(variantWhere).length > 0;

    const products = await Product.findAll({
      where,
      include: [
        { model: Category, as: 'category' },
        {
          model: Variant,
          as: 'variants',
          where: filterByVariant ? variantWhere : undefined,
          required: filterByVariant
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return products;
  }

  static async getProductById(id) {
    const product = await Product.findByPk(id, {
      include: [
        { model: Category, as: 'category' },
        { model: Variant, as: 'variants' }
      ]
    });
    if (!product) throw new AppError(ApiErrors.PRODUCT_NOT_FOUND);
    return product;
  }

  static async _resolveCategory(categoryId) {
    if (categoryId === undefined || categoryId === null || categoryId === '') return null;
    const category = await Category.findByPk(categoryId);
    if (!category) throw new AppError(ApiErrors.CATEGORY_NOT_FOUND);
    return category.id;
  }

  static async createProduct(data = {}) {
    const details = [];
    const nameErr = validateRequired(data.name, 'name', 1, 150);
    if (nameErr) details.push(nameErr);
    const priceErr = validatePrice(data.price, 'price');
    if (priceErr) details.push(priceErr);
    if (details.length > 0) throw new AppError(ApiErrors.VALIDATION_ERROR, details);

    const categoryId = await this._resolveCategory(data.category_id);

    const product = await Product.create({
      name: data.name,
      description: data.description !== undefined ? data.description : null,
      price: data.price,
      category_id: categoryId,
      images: normalizeImages(data.images)
    });

    return this.getProductById(product.id);
  }

  static async updateProduct(id, data = {}) {
    const product = await Product.findByPk(id);
    if (!product) throw new AppError(ApiErrors.PRODUCT_NOT_FOUND);

    const details = [];
    if (data.name !== undefined) {
      const nameErr = validateRequired(data.name, 'name', 1, 150);
      if (nameErr) details.push(nameErr);
    }
    if (data.price !== undefined) {
      const priceErr = validatePrice(data.price, 'price');
      if (priceErr) details.push(priceErr);
    }
    if (details.length > 0) throw new AppError(ApiErrors.VALIDATION_ERROR, details);

    const updates = {};
    if (data.name !== undefined) updates.name = data.name;
    if (data.description !== undefined) updates.description = data.description;
    if (data.price !== undefined) updates.price = data.price;
    if (data.images !== undefined) updates.images = normalizeImages(data.images);
    if (data.category_id !== undefined) {
      updates.category_id = await this._resolveCategory(data.category_id);
    }

    await product.update(updates);
    return this.getProductById(product.id);
  }

  static async deleteProduct(id) {
    const product = await Product.findByPk(id);
    if (!product) throw new AppError(ApiErrors.PRODUCT_NOT_FOUND);
    await product.destroy();
  }
}

module.exports = ProductService;
