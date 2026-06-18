const ProductService = require('../services/productService');

const listProducts = async (req, res, next) => {
  try {
    const products = await ProductService.listProducts(req.query);
    res.json(products);
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const product = await ProductService.getProductById(parseInt(req.params.id, 10));
    res.json(product);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const product = await ProductService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await ProductService.updateProduct(parseInt(req.params.id, 10), req.body);
    res.json(product);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    await ProductService.deleteProduct(parseInt(req.params.id, 10));
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

module.exports = { listProducts, getProduct, createProduct, updateProduct, deleteProduct };
