import { useEffect, useState } from 'react';
import { fetchAllOrders, updateOrderStatus } from '../api/orders';
import {
  createCategory,
  createProduct,
  createVariant,
  deleteCategory,
  deleteProduct,
  deleteVariant,
  fetchCategories,
  fetchProducts
} from '../api/catalog';
import { Alert, FieldError, LoadingSpinner } from '../components/ui';
import { formatDate, formatOrderStatus, formatPrice } from '../utils/format';
import { inputClassName, partitionErrors, toErrorState } from '../utils/errors';

const NEXT_STATUS = {
  NEW: ['PAID', 'CANCELLED'],
  PAID: ['SHIPPED', 'CANCELLED'],
  SHIPPED: [],
  CANCELLED: []
};

function countCategoryContents(node, products) {
  const directProducts = products.filter((p) => p.category_id === node.id).length;
  const childCategories = node.children?.length || 0;
  let nestedProducts = 0;
  for (const child of node.children || []) {
    nestedProducts += countCategoryContents(child, products).totalProducts;
  }
  return {
    directProducts,
    childCategories,
    totalProducts: directProducts + nestedProducts
  };
}

function CatalogTreeBranch({
  node,
  parentPath,
  products,
  busyDelete,
  onDeleteCategory,
  onDeleteProduct,
  onDeleteVariant,
  depth = 0
}) {
  const path = parentPath ? `${parentPath} › ${node.name}` : node.name;
  const contents = countCategoryContents(node, products);
  const categoryProducts = products.filter((p) => p.category_id === node.id);

  return (
    <div className="catalog-tree-branch" style={{ '--depth': depth }}>
      <div className="catalog-tree-row catalog-tree-row--category">
        <div className="catalog-tree-info">
          <span className="catalog-tree-badge">Kategoria</span>
          <strong>{node.name}</strong>
          <span className="catalog-tree-meta text-muted">
            #{node.id}
            {parentPath ? ` · w: ${parentPath}` : ' · kategoria główna'}
            {contents.childCategories > 0 && ` · ${contents.childCategories} podkategorii`}
            {contents.directProducts > 0 && ` · ${contents.directProducts} produktów`}
          </span>
        </div>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          disabled={busyDelete === `category-${node.id}`}
          onClick={() => onDeleteCategory(node.id, path, contents)}
        >
          Usuń
        </button>
      </div>

      {categoryProducts.map((product) => (
        <CatalogProductBranch
          key={product.id}
          product={product}
          categoryPath={path}
          busyDelete={busyDelete}
          onDeleteProduct={onDeleteProduct}
          onDeleteVariant={onDeleteVariant}
          depth={depth + 1}
        />
      ))}

      {(node.children || []).map((child) => (
        <CatalogTreeBranch
          key={child.id}
          node={child}
          parentPath={path}
          products={products}
          busyDelete={busyDelete}
          onDeleteCategory={onDeleteCategory}
          onDeleteProduct={onDeleteProduct}
          onDeleteVariant={onDeleteVariant}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}

function CatalogProductBranch({
  product,
  categoryPath,
  busyDelete,
  onDeleteProduct,
  onDeleteVariant,
  depth
}) {
  const variants = product.variants || [];

  return (
    <div className="catalog-tree-branch" style={{ '--depth': depth }}>
      <div className="catalog-tree-row catalog-tree-row--product">
        <div className="catalog-tree-info">
          <span className="catalog-tree-badge">Produkt</span>
          <strong>{product.name}</strong>
          <span className="catalog-tree-meta text-muted">
            #{product.id} · {formatPrice(product.price)} · kategoria: {categoryPath}
            {variants.length > 0 && ` · ${variants.length} wariantów`}
          </span>
        </div>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          disabled={busyDelete === `product-${product.id}`}
          onClick={() => onDeleteProduct(product.id, product.name, categoryPath, variants.length)}
        >
          Usuń
        </button>
      </div>

      {variants.map((variant) => (
        <div
          key={variant.id}
          className="catalog-tree-row catalog-tree-row--variant"
          style={{ '--depth': depth + 1 }}
        >
          <div className="catalog-tree-info">
            <span className="catalog-tree-badge">Wariant</span>
            <strong>
              {variant.size} / {variant.color}
            </strong>
            <span className="catalog-tree-meta text-muted">
              #{variant.id} · produkt: {product.name} · stan: {variant.stock_quantity} szt.
            </span>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            disabled={busyDelete === `variant-${variant.id}`}
            onClick={() =>
              onDeleteVariant(variant.id, product.name, variant.size, variant.color, categoryPath)
            }
          >
            Usuń
          </button>
        </div>
      ))}
    </div>
  );
}

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
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [busyDelete, setBusyDelete] = useState(null);

  const loadOrders = () => {
    setLoading(true);
    fetchAllOrders()
      .then(setOrders)
      .catch((err) => setError(toErrorState(err)))
      .finally(() => setLoading(false));
  };

  const loadCatalog = () => {
    setCatalogLoading(true);
    Promise.all([fetchCategories(), fetchProducts()])
      .then(([cats, prods]) => {
        setCategories(cats);
        setProducts(prods);
      })
      .catch((err) => setError(toErrorState(err)))
      .finally(() => setCatalogLoading(false));
  };

  useEffect(() => {
    if (tab === 'orders') loadOrders();
    if (tab === 'catalog') loadCatalog();
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
      loadCatalog();
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
      loadCatalog();
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
      loadCatalog();
    } catch (err) {
      setError(toErrorState(err));
    }
  };

  const handleDeleteCategory = async (id, path, contents) => {
    const parts = [
      `Usunąć kategorię „${path}"?`,
      'Produkty w tej kategorii stracą do niej przypisanie.'
    ];
    if (contents.childCategories > 0) {
      parts.push(`Podkategorie (${contents.childCategories}) staną się kategoriami głównymi.`);
    }
    if (contents.directProducts > 0) {
      parts.push(`Bezpośrednio przypisane produkty: ${contents.directProducts}.`);
    }
    if (!window.confirm(parts.join('\n'))) {
      return;
    }
    setBusyDelete(`category-${id}`);
    setError(null);
    try {
      await deleteCategory(id);
      setSuccess(`Kategoria „${path}” usunięta.`);
      loadCatalog();
    } catch (err) {
      setError(toErrorState(err));
    } finally {
      setBusyDelete(null);
    }
  };

  const handleDeleteProduct = async (id, name, categoryPath, variantCount) => {
    const variantInfo =
      variantCount > 0 ? `\nZostanie usuniętych także ${variantCount} wariantów.` : '';
    if (
      !window.confirm(
        `Usunąć produkt „${name}"?\nKategoria: ${categoryPath}.${variantInfo}`
      )
    ) {
      return;
    }
    setBusyDelete(`product-${id}`);
    setError(null);
    try {
      await deleteProduct(id);
      setSuccess(`Produkt „${name}” (${categoryPath}) usunięty.`);
      loadCatalog();
    } catch (err) {
      setError(toErrorState(err));
    } finally {
      setBusyDelete(null);
    }
  };

  const handleDeleteVariant = async (id, productName, size, color, categoryPath) => {
    if (
      !window.confirm(
        `Usunąć wariant ${size} / ${color}?\nProdukt: ${productName}\nKategoria: ${categoryPath}`
      )
    ) {
      return;
    }
    setBusyDelete(`variant-${id}`);
    setError(null);
    try {
      await deleteVariant(id);
      setSuccess(`Wariant ${size} / ${color} produktu „${productName}” usunięty.`);
      loadCatalog();
    } catch (err) {
      setError(toErrorState(err));
    } finally {
      setBusyDelete(null);
    }
  };

  const uncategorizedProducts = products.filter((p) => !p.category_id);

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
              {orders.length === 0 ? (
                <p className="text-muted">Brak zamówień.</p>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="card admin-order-card">
                    <div className="order-card-header">
                      <strong>#{order.id}</strong>
                      <span className={`status-badge status-${order.status.toLowerCase()}`}>
                        {formatOrderStatus(order.status)}
                      </span>
                    </div>
                    <p className="text-muted admin-order-meta">
                      Klient: użytkownik #{order.user_id} · {formatDate(order.createdAt)} ·{' '}
                      {(order.items || []).length} pozycji
                    </p>

                    <div className="admin-order-section">
                      <h3>Adres dostawy</h3>
                      <p>
                        {order.street} {order.building_number}
                        <br />
                        {order.zip_code} {order.city}, {order.country}
                      </p>
                    </div>

                    <div className="admin-order-section">
                      <h3>Pozycje zamówienia</h3>
                      {(order.items || []).length === 0 ? (
                        <p className="text-muted">Brak pozycji.</p>
                      ) : (
                        <>
                          <table className="cart-table admin-order-table">
                            <thead>
                              <tr>
                                <th>Produkt</th>
                                <th>Wariant</th>
                                <th>Ilość</th>
                                <th>Cena jedn.</th>
                                <th>Suma</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(order.items || []).map((item) => (
                                <tr key={item.id}>
                                  <td>{item.product_name}</td>
                                  <td>
                                    {item.size} / {item.color}
                                    <span className="text-muted admin-order-variant-id">
                                      {' '}
                                      (wariant #{item.variant_id})
                                    </span>
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
                        </>
                      )}
                    </div>

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
                ))
              )}
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

          <section className="card admin-catalog-manage">
            <h2>Zarządzanie katalogiem</h2>
            <p className="text-muted admin-catalog-manage-hint">
              Hierarchia: kategoria → produkt → wariant. Przy usuwaniu widoczna jest pełna ścieżka
              przypisania.
            </p>
            {catalogLoading ? (
              <LoadingSpinner label="Ładowanie katalogu…" />
            ) : categories.length === 0 && products.length === 0 ? (
              <p className="text-muted">Katalog jest pusty.</p>
            ) : (
              <div className="catalog-tree">
                {categories.map((node) => (
                  <CatalogTreeBranch
                    key={node.id}
                    node={node}
                    parentPath=""
                    products={products}
                    busyDelete={busyDelete}
                    onDeleteCategory={handleDeleteCategory}
                    onDeleteProduct={handleDeleteProduct}
                    onDeleteVariant={handleDeleteVariant}
                  />
                ))}

                {uncategorizedProducts.length > 0 && (
                  <div className="catalog-tree-uncategorized">
                    <h3>Produkty bez kategorii</h3>
                    {uncategorizedProducts.map((product) => (
                      <CatalogProductBranch
                        key={product.id}
                        product={product}
                        categoryPath="Bez kategorii"
                        busyDelete={busyDelete}
                        onDeleteProduct={handleDeleteProduct}
                        onDeleteVariant={handleDeleteVariant}
                        depth={0}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
