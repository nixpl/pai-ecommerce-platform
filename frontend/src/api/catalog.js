import config from '../config';
import { apiFetch } from './client';

const base = `${config.catalogServiceUrl}/api`;

export async function fetchProducts(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') query.set(key, value);
  });
  const qs = query.toString();
  return apiFetch(`${base}/products${qs ? `?${qs}` : ''}`, { skipAuth: true });
}

export async function fetchProduct(id) {
  return apiFetch(`${base}/products/${id}`, { skipAuth: true });
}

export async function fetchCategories() {
  return apiFetch(`${base}/categories`, { skipAuth: true });
}

export async function createProduct(data) {
  return apiFetch(`${base}/products`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function createVariant(productId, data) {
  return apiFetch(`${base}/products/${productId}/variants`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function createCategory(data) {
  return apiFetch(`${base}/categories`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function deleteCategory(id) {
  return apiFetch(`${base}/categories/${id}`, { method: 'DELETE' });
}

export async function deleteProduct(id) {
  return apiFetch(`${base}/products/${id}`, { method: 'DELETE' });
}

export async function deleteVariant(id) {
  return apiFetch(`${base}/variants/${id}`, { method: 'DELETE' });
}
