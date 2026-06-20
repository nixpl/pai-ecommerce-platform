const { AppError } = require('shared-utils');
const { ApiErrors } = require('../errors/apiErrors');

const PROFILE_SERVICE_URL = process.env.PROFILE_SERVICE_URL || 'http://localhost:3002';

const handleResponse = async (response) => {
  if (response.ok) {
    return response.json();
  }

  const body = await response.json().catch(() => null);
  if (response.status === 404 || body?.error?.code === 24005) {
    throw new AppError(ApiErrors.ADDRESS_NOT_FOUND);
  }
  throw new AppError(ApiErrors.EXTERNAL_SERVICE_ERROR);
};

class ProfileClient {
  static async getAddress(addressId, authToken) {
    const response = await fetch(`${PROFILE_SERVICE_URL}/api/profiles/addresses`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    const addresses = await handleResponse(response);
    const address = addresses.find((item) => item.id === addressId);
    if (!address) {
      throw new AppError(ApiErrors.ADDRESS_NOT_FOUND);
    }
    return address;
  }
}

module.exports = ProfileClient;
