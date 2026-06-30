import { useEffect, useState } from 'react';
import { fetchCategories, fetchProducts } from '../api/catalog';
import ProductCard from '../components/ProductCard';
import { Alert, EmptyState, LoadingSpinner } from '../components/ui';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    priceMin: '',
    priceMax: ''
  });

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchProducts(filters)
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filters]);

  const flatCategories = flattenCategories(categories);

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-content">
          <h1>Odkryj produkty w PAI Shop</h1>
          <p className="hero-sub">
            Przeglądaj, dodawaj do koszyka i składaj zamówienia.
          </p>
        </div>
      </section>

      <section className="filters-bar">
        <input
          type="search"
          placeholder="Szukaj produktów…"
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          className="input"
        />
        <select
          value={filters.category}
          onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
          className="input"
        >
          <option value="">Wszystkie kategorie</option>
          {flatCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Cena od"
          min="0"
          value={filters.priceMin}
          onChange={(e) => setFilters((f) => ({ ...f, priceMin: e.target.value }))}
          className="input input-narrow"
        />
        <input
          type="number"
          placeholder="Cena do"
          min="0"
          value={filters.priceMax}
          onChange={(e) => setFilters((f) => ({ ...f, priceMax: e.target.value }))}
          className="input input-narrow"
        />
      </section>

      <Alert message={error} onClose={() => setError(null)} />

      {loading ? (
        <LoadingSpinner label="Pobieranie produktów…" />
      ) : products.length === 0 ? (
        <EmptyState
          title="Brak produktów"
          description="Katalog jest pusty lub filtry nie pasują do żadnego wyniku."
        />
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

function flattenCategories(tree, depth = 0) {
  const result = [];
  for (const node of tree || []) {
    result.push({
      id: node.id,
      label: `${'— '.repeat(depth)}${node.name}`
    });
    if (node.children?.length) {
      result.push(...flattenCategories(node.children, depth + 1));
    }
  }
  return result;
}
