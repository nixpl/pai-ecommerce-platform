import config from '../config';
import { apiFetch } from './client';

const base = `${config.orderServiceUrl}/api`;

export async function fetchCart() {
  return apiFetch(`${base}/cart`);
}

export async function addCartItem(variantId, quantity = 1) {
  return apiFetch(`${base}/cart/items`, {
    method: 'POST',
    body: JSON.stringify({ variant_id: variantId, quantity })
  });
}

export async function updateCartItem(variantId, quantity) {
  return apiFetch(`${base}/cart/items/${variantId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity })
  });
}

export async function removeCartItem(variantId) {
  return apiFetch(`${base}/cart/items/${variantId}`, {
    method: 'DELETE'
  });
}

export async function fetchMyOrders() {
  return apiFetch(`${base}/orders`);
}

export async function fetchAllOrders() {
  return apiFetch(`${base}/orders/admin/all`);
}

export async function fetchOrder(id) {
  return apiFetch(`${base}/orders/${id}`);
}

export async function createOrder(addressId) {
  return apiFetch(`${base}/orders`, {
    method: 'POST',
    body: JSON.stringify({ address_id: addressId })
  });
}

export async function updateOrderStatus(id, status) {
  return apiFetch(`${base}/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
}
