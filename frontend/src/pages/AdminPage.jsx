import { useEffect, useState } from 'react';
import { fetchAllOrders, updateOrderStatus } from '../api/orders';
import { createCategory, createProduct, createVariant } from '../api/catalog';
import { Alert, FieldError, LoadingSpinner } from '../components/ui';
import { formatDate, formatOrderStatus, formatPrice } from '../utils/format';
import { inputClassName, partitionErrors, toErrorState } from '../utils/errors';

const NEXT_STATUS = {
  NEW: ['PAID', 'CANCELLED'],
  PAID: ['SHIPPED', 'CANCELLED'],
  SHIPPED: [],
  CANCELLED: []
};

export default function AdminPage() {
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [busyOrder, setBusyOrder] = useState(null);
  const { fields } = partitionErrors(error);

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    images: ''
  });
  const [variantForm, setVariantForm] = useState({
    product_id: '',
    size: '',
    color: '',
    stock_quantity: ''
  });
  const [categoryForm, setCategoryForm] = useState({ name: '', parent_id: '' });

  const loadOrders = () => {
    setLoading(true);
    fetchAllOrders()
      .then(setOrders)
      .catch((err) => setError(toErrorState(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (tab === 'orders') loadOrders();
  }, [tab]);

  const handleStatusChange = async (orderId, status) => {
    setBusyOrder(orderId);
    setError(null);
    try {
      const updated = await updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      setSuccess(`Status zamówienia #${orderId} zmieniony na ${formatOrderStatus(status)}.`);
    } catch (err) {
      setError(toErrorState(err));
    } finally {
      setBusyOrder(null);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const images = productForm.images
        ? productForm.images.split(',').map((s) => s.trim()).filter(Boolean)
        : [];
      await createProduct({
        name: productForm.name,
        description: productForm.description || null,
        price: Number(productForm.price),
        category_id: productForm.category_id ? Number(productForm.category_id) : null,
        images
      });
      setProductForm({ name: '', description: '', price: '', category_id: '', images: '' });
      setSuccess('Produkt utworzony.');
    } catch (err) {
      setError(toErrorState(err));
    }
  };

  const handleCreateVariant = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await createVariant(Number(variantForm.product_id), {
        size: variantForm.size,
        color: variantForm.color,
        stock_quantity: Number(variantForm.stock_quantity)
      });
      setVariantForm({ product_id: '', size: '', color: '', stock_quantity: '' });
      setSuccess('Wariant dodany.');
    } catch (err) {
      setError(toErrorState(err));
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await createCategory({
        name: categoryForm.name,
        parent_id: categoryForm.parent_id ? Number(categoryForm.parent_id) : null
      });
      setCategoryForm({ name: '', parent_id: '' });
      setSuccess('Kategoria utworzona.');
    } catch (err) {
      setError(toErrorState(err));
    }
  };

  return (
    <div className="page admin-page">
      <h1>Panel administratora</h1>
      <p className="text-muted">Zarządzanie zamówieniami i katalogiem (wymaga roli admin).</p>

      <div className="admin-tabs">
        <button
          type="button"
          className={tab === 'orders' ? 'tab active' : 'tab'}
          onClick={() => setTab('orders')}
        >
          Zamówienia
        </button>
        <button
          type="button"
          className={tab === 'catalog' ? 'tab active' : 'tab'}
          onClick={() => setTab('catalog')}
        >
          Katalog
        </button>
      </div>

      <Alert error={error} onClose={() => setError(null)} />
      <Alert message={success} type="success" onClose={() => setSuccess(null)} />

      {tab === 'orders' && (
        <>
          {loading ? (
            <LoadingSpinner label="Ładowanie zamówień…" />
          ) : (
            <div className="admin-orders">
              {orders.map((order) => (
                <div key={order.id} className="card admin-order-card">
                  <div className="order-card-header">
                    <strong>#{order.id}</strong>
                    <span className={`status-badge status-${order.status.toLowerCase()}`}>
                      {formatOrderStatus(order.status)}
                    </span>
                  </div>
                  <p className="text-muted">
                    Użytkownik {order.user_id} · {formatDate(order.createdAt)} ·{' '}
                    {formatPrice(order.total)}
                  </p>
                  <div className="status-actions">
                    {(NEXT_STATUS[order.status] || []).map((status) => (
                      <button
                        key={status}
                        type="button"
                        className="btn btn-secondary btn-sm"
                        disabled={busyOrder === order.id}
                        onClick={() => handleStatusChange(order.id, status)}
                      >
                        → {formatOrderStatus(status)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'catalog' && (
        <div className="admin-catalog-grid">
          <form onSubmit={handleCreateCategory} className="card stack-form" noValidate>
            <h2>Nowa kategoria</h2>
            <label>
              Nazwa
              <input
                className={inputClassName('input', fields, 'name')}
                value={categoryForm.name}
                onChange={(e) => setCategoryForm((f) => ({ ...f, name: e.target.value }))}
              />
              <FieldError message={fields.name} />
            </label>
            <label>
              ID kategorii nadrzędnej (opcjonalnie)
              <input
                className="input"
                value={categoryForm.parent_id}
                onChange={(e) => setCategoryForm((f) => ({ ...f, parent_id: e.target.value }))}
              />
            </label>
            <button type="submit" className="btn btn-primary">
              Utwórz kategorię
            </button>
          </form>

          <form onSubmit={handleCreateProduct} className="card stack-form" noValidate>
            <h2>Nowy produkt</h2>
            <label>
              Nazwa
              <input
                className={inputClassName('input', fields, 'name')}
                value={productForm.name}
                onChange={(e) => setProductForm((f) => ({ ...f, name: e.target.value }))}
              />
              <FieldError message={fields.name} />
            </label>
            <label>
              Opis
              <textarea
                className="input"
                rows={3}
                value={productForm.description}
                onChange={(e) =>
                  setProductForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </label>
            <label>
              Cena
              <input
                type="number"
                step="0.01"
                className={inputClassName('input', fields, 'price')}
                value={productForm.price}
                onChange={(e) => setProductForm((f) => ({ ...f, price: e.target.value }))}
              />
              <FieldError message={fields.price} />
            </label>
            <label>
              ID kategorii
              <input
                className="input"
                value={productForm.category_id}
                onChange={(e) =>
                  setProductForm((f) => ({ ...f, category_id: e.target.value }))
                }
              />
            </label>
            <label>
              URL obrazków (po przecinku)
              <input
                className="input"
                value={productForm.images}
                onChange={(e) => setProductForm((f) => ({ ...f, images: e.target.value }))}
              />
            </label>
            <button type="submit" className="btn btn-primary">
              Utwórz produkt
            </button>
          </form>

          <form onSubmit={handleCreateVariant} className="card stack-form" noValidate>
            <h2>Nowy wariant</h2>
            <label>
              ID produktu
              <input
                className={inputClassName('input', fields, 'product_id')}
                value={variantForm.product_id}
                onChange={(e) =>
                  setVariantForm((f) => ({ ...f, product_id: e.target.value }))
                }
              />
              <FieldError message={fields.product_id} />
            </label>
            <label>
              Rozmiar
              <input
                className={inputClassName('input', fields, 'size')}
                value={variantForm.size}
                onChange={(e) => setVariantForm((f) => ({ ...f, size: e.target.value }))}
              />
              <FieldError message={fields.size} />
            </label>
            <label>
              Kolor
              <input
                className={inputClassName('input', fields, 'color')}
                value={variantForm.color}
                onChange={(e) => setVariantForm((f) => ({ ...f, color: e.target.value }))}
              />
              <FieldError message={fields.color} />
            </label>
            <label>
              Stan magazynowy
              <input
                type="number"
                className={inputClassName('input', fields, 'stock_quantity')}
                value={variantForm.stock_quantity}
                onChange={(e) =>
                  setVariantForm((f) => ({ ...f, stock_quantity: e.target.value }))
                }
              />
              <FieldError message={fields.stock_quantity} />
            </label>
            <button type="submit" className="btn btn-primary">
              Dodaj wariant
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
