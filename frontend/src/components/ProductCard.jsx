import { Link } from 'react-router-dom';
import { formatPrice, getProductImage, getProductPlaceholder } from '../utils/format';

export default function ProductCard({ product }) {
  const imageUrl = getProductImage(product.images) || getProductPlaceholder(product.name);
  const variantCount = product.variants?.length ?? 0;

  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-card-link">
        <div className="product-card-image">
          <img src={imageUrl} alt={product.name} loading="lazy" />
        </div>
        <div className="product-card-body">
          {product.category && (
            <span className="product-category">{product.category.name}</span>
          )}
          <h3>{product.name}</h3>
          <p className="product-desc">{product.description || 'Brak opisu'}</p>
          <div className="product-card-footer">
            <span className="product-price">{formatPrice(product.price)}</span>
            <span className="product-variants">
              {variantCount} {variantCount === 1 ? 'wariant' : 'wariantów'}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
