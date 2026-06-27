export function formatPrice(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return '—';
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN'
  }).format(num);
}

export function formatDate(iso) {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('pl-PL', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(iso));
}

const STATUS_LABELS = {
  NEW: 'Nowe',
  PAID: 'Opłacone',
  SHIPPED: 'Wysłane',
  CANCELLED: 'Anulowane'
};

export function formatOrderStatus(status) {
  return STATUS_LABELS[status] || status;
}

export function getProductImage(images) {
  if (Array.isArray(images) && images.length > 0) return images[0];
  return null;
}

export function getProductPlaceholder(name) {
  const letter = (name || '?').charAt(0).toUpperCase();
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(letter)}&background=6366f1&color=fff&size=400&bold=true`;
}
