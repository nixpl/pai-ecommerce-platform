import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchOrder } from '../api/orders';
import { Alert, LoadingSpinner } from '../components/ui';
import { formatDate, formatOrderStatus, formatPrice } from '../utils/format';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrder(id)
      .then(setOrder)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner label="Ładowanie zamówienia…" />;

  if (!order) {
    return (
      <div className="page">
        <Alert message={error || 'Zamówienie nie zostało znalezione.'} />
        <Link to="/orders" className="btn btn-ghost">
          ← Moje zamówienia
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <Link to="/orders" className="back-link">
        ← Moje zamówienia
      </Link>

      <div className="order-detail-header">
        <h1>Zamówienie #{order.id}</h1>
        <span className={`status-badge status-${order.status.toLowerCase()}`}>
          {formatOrderStatus(order.status)}
        </span>
      </div>

      <p className="text-muted">Złożono: {formatDate(order.createdAt)}</p>

      <div className="card order-detail-card">
        <h2>Adres dostawy</h2>
        <p>
          {order.street} {order.building_number}
          <br />
          {order.zip_code} {order.city}, {order.country}
        </p>
      </div>

      <div className="card">
        <h2>Pozycje</h2>
        <table className="cart-table">
          <thead>
            <tr>
              <th>Produkt</th>
              <th>Wariant</th>
              <th>Ilość</th>
              <th>Cena</th>
              <th>Suma</th>
            </tr>
          </thead>
          <tbody>
            {(order.items || []).map((item) => (
              <tr key={item.id}>
                <td>{item.product_name}</td>
                <td>
                  {item.size} / {item.color}
                </td>
                <td>{item.quantity}</td>
                <td>{formatPrice(item.unit_price)}</td>
                <td>{formatPrice(Number(item.unit_price) * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="cart-total">
          <span>Razem</span>
          <strong>{formatPrice(order.total)}</strong>
        </div>
      </div>
    </div>
  );
}
