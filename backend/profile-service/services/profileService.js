const { Profile, Address } = require('../models');
const { AppError, ValidationErrorDetail, ValidationErrors, validateRequired, validatePhone } = require('shared-utils');
const { ApiErrors } = require('../errors/apiErrors');

class ProfileService {
  static async createProfile(accountId, profileData = {}) {
    const profile = await Profile.findOne({ where: { account_id: accountId } });

    if (profile) {
      throw new AppError(ApiErrors.PROFILE_ALREADY_EXISTS);
    }

    const details = [];
    const firstNameErr = validateRequired(profileData.first_name, 'first_name', 1, 50);
    if (firstNameErr) details.push(firstNameErr);
    const lastNameErr = validateRequired(profileData.last_name, 'last_name', 1, 50);
    if (lastNameErr) details.push(lastNameErr);
    const phoneErr = validatePhone(profileData.phone, 'phone');
    if (phoneErr) details.push(phoneErr);

    if (details.length > 0) throw new AppError(ApiErrors.VALIDATION_ERROR, details);

    const newProfile = await Profile.create({ account_id: accountId, first_name: profileData.first_name, last_name: profileData.last_name, phone: profileData.phone });
    return newProfile;
  }

  static async getProfileByAccountId(accountId) {
    const profile = await Profile.findOne({ where: { account_id: accountId }, include: [{ model: Address, as: 'addresses' }] });
    if (!profile) {
      throw new AppError(ApiErrors.PROFILE_NOT_FOUND);
    }
    return profile;
  }

  static async updateProfile(accountId, profileData) {
    const profile = await this.getProfileByAccountId(accountId);

    const details = [];
      if (profileData.first_name !== undefined) {
      const firstNameErr = validateRequired(profileData.first_name, 'first_name', 1, 50);
      if (firstNameErr) details.push(firstNameErr);
    }
    if (profileData.last_name !== undefined) {
      const lastNameErr = validateRequired(profileData.last_name, 'last_name', 1, 50);
      if (lastNameErr) details.push(lastNameErr);
    }
    if (profileData.phone !== undefined) {
      const phoneErr = validatePhone(profileData.phone, 'phone');
      if (phoneErr) details.push(phoneErr);
    }

    if (details.length > 0) throw new AppError(ApiErrors.VALIDATION_ERROR, details);

    await profile.update({
      first_name: profileData.first_name !== undefined ? profileData.first_name : profile.first_name,
      last_name: profileData.last_name !== undefined ? profileData.last_name : profile.last_name,
      phone: profileData.phone !== undefined ? profileData.phone : profile.phone
    });

    return profile;
  }
}

module.exports = ProfileService;
