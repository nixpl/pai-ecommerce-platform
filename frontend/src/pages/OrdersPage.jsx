import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchMyOrders } from '../api/orders';
import { Alert, EmptyState, LoadingSpinner } from '../components/ui';
import { formatDate, formatOrderStatus, formatPrice } from '../utils/format';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyOrders()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Ładowanie zamówień…" />;

  return (
    <div className="page">
      <h1>Moje zamówienia</h1>
      <Alert message={error} onClose={() => setError(null)} />

      {orders.length === 0 ? (
        <EmptyState
          title="Brak zamówień"
          description="Twoje zamówienia pojawią się tutaj po złożeniu pierwszego."
          action={
            <Link to="/" className="btn btn-primary">
              Przeglądaj produkty
            </Link>
          }
        />
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <Link key={order.id} to={`/orders/${order.id}`} className="order-card card">
              <div className="order-card-header">
                <span className="order-id">#{order.id}</span>
                <span className={`status-badge status-${order.status.toLowerCase()}`}>
                  {formatOrderStatus(order.status)}
                </span>
              </div>
              <p className="order-meta">{formatDate(order.createdAt)}</p>
              <p className="order-total">{formatPrice(order.total)}</p>
              <p className="text-muted">{order.items?.length ?? 0} pozycji</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
