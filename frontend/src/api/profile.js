import config from '../config';
import { apiFetch } from './client';

const base = `${config.profileServiceUrl}/api/profiles`;

export async function fetchMyProfile() {
  return apiFetch(`${base}/me`);
}

export async function createProfile(data) {
  return apiFetch(base, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateProfile(data) {
  return apiFetch(`${base}/me`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function fetchAddresses() {
  return apiFetch(`${base}/addresses`);
}

export async function createAddress(data) {
  return apiFetch(`${base}/addresses`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateAddress(id, data) {
  return apiFetch(`${base}/addresses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteAddress(id) {
  return apiFetch(`${base}/addresses/${id}`, {
    method: 'DELETE'
  });
}
