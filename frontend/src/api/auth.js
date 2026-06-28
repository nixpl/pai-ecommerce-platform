import config from '../config';
import { apiFetch } from './client';

const base = `${config.authServiceUrl}/api/auth`;

export async function login(email, password) {
  return apiFetch(`${base}/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    skipAuth: true
  });
}

export async function register(email, password) {
  return apiFetch(`${base}/register`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    skipAuth: true
  });
}
