const ProfileService = require('../services/profileService');

const createProfile = async (req, res, next) => {
  try {
    const newProfile = await ProfileService.createProfile(req.account.id, req.body);
    res.status(201).json(newProfile);
  } catch (error) {
    next(error);
  }
};

const getMyProfile = async (req, res, next) => {
  try {
    const profile = await ProfileService.getProfileByAccountId(req.account.id);
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

const updateMyProfile = async (req, res, next) => {
  try {
    const updatedProfile = await ProfileService.updateProfile(req.account.id, req.body);
    res.json(updatedProfile);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProfile,
  getMyProfile,
  updateMyProfile
};
