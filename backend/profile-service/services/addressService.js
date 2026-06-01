const { Profile, Address } = require('../models');
const { AppError, validateRequired, validateZip } = require('shared-utils');
const { ApiErrors } = require('../errors/apiErrors');

class AddressService {
  static async createAddress(accountId, addressData) {
    const profile = await Profile.findOne({ where: { account_id: accountId } });
    if (!profile) throw new AppError(ApiErrors.PROFILE_NOT_FOUND);
    const details = [];
    const streetErr = validateRequired(addressData.street, 'street', 1, 100); if (streetErr) details.push(streetErr);
    const buildingErr = validateRequired(addressData.building_number, 'building_number', 1, 10); if (buildingErr) details.push(buildingErr);
    const cityErr = validateRequired(addressData.city, 'city', 1, 50); if (cityErr) details.push(cityErr);
    const zipErr = validateZip(addressData.zip_code, 'zip_code'); if (zipErr) details.push(zipErr);
    const countryErr = validateRequired(addressData.country, 'country', 1, 50); if (countryErr) details.push(countryErr);

    if (details.length > 0) throw new AppError(ApiErrors.VALIDATION_ERROR, details);

    const addr = await Address.create({ profile_id: profile.id, ...addressData });
    return addr;
  }

  static async getAddresses(accountId) {
    const profile = await Profile.findOne({ where: { account_id: accountId }, include: [{ model: Address, as: 'addresses' }] });
    if (!profile) throw new AppError(ApiErrors.PROFILE_NOT_FOUND);
    return profile.addresses;
  }

  static async updateAddress(accountId, addressId, addressData) {
    const profile = await Profile.findOne({ where: { account_id: accountId } });
    if (!profile) throw new AppError(ApiErrors.PROFILE_NOT_FOUND);

    const addr = await Address.findOne({ where: { id: addressId } });
    if (!addr) throw new AppError(ApiErrors.ADDRESS_NOT_FOUND);
    if (addr.profile_id !== profile.id) throw new AppError(ApiErrors.PROFILE_NOT_FOUND);
    const details = [];
    if (addressData.street !== undefined) {
      const streetErr = validateRequired(addressData.street, 'street', 1, 100); if (streetErr) details.push(streetErr);
    }
    if (addressData.building_number !== undefined) {
      const buildingErr = validateRequired(addressData.building_number, 'building_number', 1, 10); if (buildingErr) details.push(buildingErr);
    }
    if (addressData.city !== undefined) {
      const cityErr = validateRequired(addressData.city, 'city', 1, 50); if (cityErr) details.push(cityErr);
    }
    if (addressData.zip_code !== undefined) {
      const zipErr = validateZip(addressData.zip_code, 'zip_code'); if (zipErr) details.push(zipErr);
    }
    if (addressData.country !== undefined) {
      const countryErr = validateRequired(addressData.country, 'country', 1, 50); if (countryErr) details.push(countryErr);
    }

    if (details.length > 0) throw new AppError(ApiErrors.VALIDATION_ERROR, details);

    await addr.update(addressData);
    return addr;
  }

  static async deleteAddress(accountId, addressId) {
    const profile = await Profile.findOne({ where: { account_id: accountId } });
    if (!profile) throw new AppError(ApiErrors.PROFILE_NOT_FOUND);

    const addr = await Address.findOne({ where: { id: addressId } });
    if (!addr) throw new AppError(ApiErrors.ADDRESS_NOT_FOUND);
    if (addr.profile_id !== profile.id) throw new AppError(ApiErrors.PROFILE_NOT_FOUND);

    await addr.destroy();
    return;
  }
}

module.exports = AddressService;
