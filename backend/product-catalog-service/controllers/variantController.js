const VariantService = require('../services/variantService');

const getVariant = async (req, res, next) => {
  try {
    const variant = await VariantService.getVariantById(parseInt(req.params.id, 10));
    res.json(variant);
  } catch (error) {
    next(error);
  }
};

const createVariant = async (req, res, next) => {
  try {
    const variant = await VariantService.createVariant(parseInt(req.params.id, 10), req.body);
    res.status(201).json(variant);
  } catch (error) {
    next(error);
  }
};

const updateVariant = async (req, res, next) => {
  try {
    const variant = await VariantService.updateVariant(parseInt(req.params.id, 10), req.body);
    res.json(variant);
  } catch (error) {
    next(error);
  }
};

const updateStock = async (req, res, next) => {
  try {
    const variant = await VariantService.updateStock(parseInt(req.params.id, 10), req.body.stock_quantity);
    res.json(variant);
  } catch (error) {
    next(error);
  }
};

const deleteVariant = async (req, res, next) => {
  try {
    await VariantService.deleteVariant(parseInt(req.params.id, 10));
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

module.exports = { getVariant, createVariant, updateVariant, updateStock, deleteVariant };
