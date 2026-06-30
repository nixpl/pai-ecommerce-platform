const sequelize = require('../config/database');
const Product = require('./Product');
const Category = require('./Category');
const Variant = require('./Variant');

// Drzewo kategorii (self-reference)
Category.hasMany(Category, { foreignKey: 'parent_id', as: 'children' });
Category.belongsTo(Category, { foreignKey: 'parent_id', as: 'parent' });

// Produkt należy do jednej kategorii (opcjonalnie)
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// Produkt ma wiele wariantów; usunięcie produktu kasuje warianty (CASCADE)
Product.hasMany(Variant, { foreignKey: 'product_id', as: 'variants', onDelete: 'CASCADE', hooks: true });
Variant.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

module.exports = {
  sequelize,
  Product,
  Category,
  Variant
};
