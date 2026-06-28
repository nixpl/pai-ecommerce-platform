import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Alert, EmptyState, LoadingSpinner } from '../components/ui';
import { formatPrice } from '../utils/format';

export default function CartPage() {
  const { cart, loading, updateItem, removeItem } = useCart();
  const [error, setError] = useState(null);
  const [busyVariant, setBusyVariant] = useState(null);

  const handleQuantityChange = async (variantId, quantity) => {
    if (quantity < 1) return;
    setBusyVariant(variantId);
    setError(null);
    try {
      await updateItem(variantId, quantity);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyVariant(null);
    }
  };

  const handleRemove = async (variantId) => {
    setBusyVariant(variantId);
    setError(null);
    try {
      await removeItem(variantId);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyVariant(null);
    }
  };

  if (loading) return <LoadingSpinner label="Ładowanie koszyka…" />;

  const items = cart?.items || [];

  return (
    <div className="page">
      <h1>Koszyk</h1>
      <Alert message={error} onClose={() => setError(null)} />

      {items.length === 0 ? (
        <EmptyState
          title="Koszyk jest pusty"
          description="Dodaj produkty z katalogu, aby kontynuować zakupy."
          action={
            <Link to="/" className="btn btn-primary">
              Przeglądaj katalog
            </Link>
          }
        />
      ) : (
        <>
          <div className="cart-table-wrap">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Produkt</th>
                  <th>Wariant</th>
                  <th>Cena</th>
                  <th>Ilość</th>
                  <th>Suma</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.variant_id}>
                    <td>{item.product_name}</td>
                    <td>
                      {item.size} / {item.color}
                    </td>
                    <td>{formatPrice(item.unit_price)}</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        max={item.stock_quantity}
                        value={item.quantity}
                        disabled={busyVariant === item.variant_id}
                        onChange={(e) =>
                          handleQuantityChange(item.variant_id, Number(e.target.value))
                        }
                        className="input input-narrow"
                      />
                    </td>
                    <td>{formatPrice(item.line_total)}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        disabled={busyVariant === item.variant_id}
                        onClick={() => handleRemove(item.variant_id)}
                      >
                        Usuń
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="cart-summary">
            <div className="cart-total">
              <span>Razem</span>
              <strong>{formatPrice(cart.total)}</strong>
            </div>
            <Link to="/checkout" className="btn btn-primary">
              Przejdź do zamówienia
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
