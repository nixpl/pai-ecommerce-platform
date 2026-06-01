const AddressService = require('../services/addressService');

const createAddress = async (req, res, next) => {
  try {
    const addr = await AddressService.createAddress(req.account.id, req.body);
    res.status(201).json(addr);
  } catch (err) {
    next(err);
  }
};

const listAddresses = async (req, res, next) => {
  try {
    const addrs = await AddressService.getAddresses(req.account.id);
    res.json(addrs);
  } catch (err) {
    next(err);
  }
};

const updateAddress = async (req, res, next) => {
  try {
    const addr = await AddressService.updateAddress(req.account.id, parseInt(req.params.id, 10), req.body);
    res.json(addr);
  } catch (err) {
    next(err);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    await AddressService.deleteAddress(req.account.id, parseInt(req.params.id, 10));
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

module.exports = { createAddress, listAddresses, updateAddress, deleteAddress };