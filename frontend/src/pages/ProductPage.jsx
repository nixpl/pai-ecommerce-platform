import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchProduct } from '../api/catalog';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Alert, LoadingSpinner } from '../components/ui';
import { formatPrice, getProductImage, getProductPlaceholder } from '../utils/format';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchProduct(id)
      .then((data) => {
        setProduct(data);
        if (data.variants?.length) {
          setSelectedVariant(data.variants[0].id);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/products/${id}` } });
      return;
    }
    if (!selectedVariant) return;

    setAdding(true);
    setSuccess(null);
    setError(null);
    try {
      await addItem(selectedVariant, quantity);
      setSuccess('Dodano do koszyka!');
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <LoadingSpinner label="Ładowanie produktu…" />;
  if (!product) {
    return (
      <div className="page">
        <Alert message={error || 'Produkt nie został znaleziony.'} />
        <Link to="/" className="btn btn-ghost">
          ← Wróć do katalogu
        </Link>
      </div>
    );
  }

  const imageUrl = getProductImage(product.images) || getProductPlaceholder(product.name);
  const variants = product.variants || [];

  return (
    <div className="page product-detail">
      <Link to="/" className="back-link">
        ← Katalog
      </Link>

      <div className="product-detail-grid">
        <div className="product-detail-image">
          <img src={imageUrl} alt={product.name} />
        </div>

        <div className="product-detail-info">
          {product.category && (
            <span className="product-category">{product.category.name}</span>
          )}
          <h1>{product.name}</h1>
          <p className="product-detail-price">{formatPrice(product.price)}</p>
          <p className="product-detail-desc">{product.description || 'Brak opisu produktu.'}</p>

          {variants.length > 0 ? (
            <div className="variant-picker">
              <label htmlFor="variant">Wariant (rozmiar / kolor)</label>
              <select
                id="variant"
                value={selectedVariant ?? ''}
                onChange={(e) => setSelectedVariant(Number(e.target.value))}
                className="input"
              >
                {variants.map((v) => (
                  <option key={v.id} value={v.id} disabled={v.stock_quantity <= 0}>
                    {v.size} / {v.color} — dostępne: {v.stock_quantity}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p className="text-muted">Brak dostępnych wariantów.</p>
          )}

          <div className="quantity-row">
            <label htmlFor="qty">Ilość</label>
            <input
              id="qty"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="input input-narrow"
            />
          </div>

          <Alert message={error} type="error" onClose={() => setError(null)} />
          <Alert message={success} type="success" onClose={() => setSuccess(null)} />

          <div className="product-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddToCart}
              disabled={adding || !selectedVariant || variants.length === 0}
            >
              {adding ? 'Dodawanie…' : 'Dodaj do koszyka'}
            </button>
            {isAuthenticated && (
              <Link to="/cart" className="btn btn-secondary">
                Przejdź do koszyka
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
