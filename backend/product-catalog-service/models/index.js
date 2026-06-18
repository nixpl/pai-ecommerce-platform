const sequelize = require('../config/database');
const Product = require('./Product');
const Category = require('./Category');
const Variant = require('./Variant');

Category.hasMany(Category, { foreignKey: 'parent_id', as: 'children' });
Category.belongsTo(Category, { foreignKey: 'parent_id', as: 'parent' });

Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

Product.hasMany(Variant, { foreignKey: 'product_id', as: 'variants', onDelete: 'CASCADE', hooks: true });
Variant.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

module.exports = {
  sequelize,
  Product,
  Category,
  Variant
};
