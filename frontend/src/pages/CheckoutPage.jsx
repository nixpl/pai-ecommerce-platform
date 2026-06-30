import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createOrder } from '../api/orders';
import { fetchAddresses } from '../api/profile';
import { useCart } from '../context/CartContext';
import { Alert, EmptyState, LoadingSpinner } from '../components/ui';
import { formatPrice } from '../utils/format';
import { toErrorState } from '../utils/errors';

export default function CheckoutPage() {
  const { cart, refreshCart } = useCart();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAddresses()
      .then((data) => {
        setAddresses(data);
        if (data.length) setSelectedAddress(String(data[0].id));
      })
      .catch((err) => setError(toErrorState(err)))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAddress) return;

    setSubmitting(true);
    setError(null);
    try {
      const order = await createOrder(Number(selectedAddress));
      await refreshCart();
      navigate(`/orders/${order.id}`);
    } catch (err) {
      setError(toErrorState(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Przygotowywanie zamówienia…" />;

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <EmptyState
        title="Brak produktów w koszyku"
        description="Dodaj coś do koszyka przed złożeniem zamówienia."
        action={
          <Link to="/" className="btn btn-primary">
            Wróć do sklepu
          </Link>
        }
      />
    );
  }

  return (
    <div className="page checkout-page">
      <h1>Złóż zamówienie</h1>
      <Alert error={error} onClose={() => setError(null)} />

      <div className="checkout-grid">
        <form onSubmit={handleSubmit} className="checkout-form card" noValidate>
          <h2>Adres dostawy</h2>
          {addresses.length === 0 ? (
            <div>
              <p className="text-muted">Najpierw dodaj adres w profilu.</p>
              <Link to="/profile" className="btn btn-secondary">
                Przejdź do profilu
              </Link>
            </div>
          ) : (
            <>
              <div className="address-list">
                {addresses.map((addr) => (
                  <label key={addr.id} className="address-option">
                    <input
                      type="radio"
                      name="address"
                      value={addr.id}
                      checked={selectedAddress === String(addr.id)}
                      onChange={(e) => setSelectedAddress(e.target.value)}
                    />
                    <span>
                      {addr.street} {addr.building_number}, {addr.zip_code} {addr.city},{' '}
                      {addr.country}
                    </span>
                  </label>
                ))}
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={submitting || !selectedAddress}
              >
                {submitting ? 'Składanie zamówienia…' : 'Potwierdź zamówienie'}
              </button>
            </>
          )}
        </form>

        <aside className="checkout-summary card">
          <h2>Podsumowanie</h2>
          <ul className="checkout-items">
            {items.map((item) => (
              <li key={item.variant_id}>
                <span>
                  {item.product_name} × {item.quantity}
                </span>
                <span>{formatPrice(item.line_total)}</span>
              </li>
            ))}
          </ul>
          <div className="cart-total">
            <span>Razem</span>
            <strong>{formatPrice(cart.total)}</strong>
          </div>
        </aside>
      </div>
    </div>
  );
}
