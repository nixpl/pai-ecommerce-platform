import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { isAuthenticated, isAdmin, account, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-icon">◆</span>
          PAI Shop
        </Link>

        <nav className="nav-links">
          <NavLink to="/" end>
            Katalog
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/orders">Zamówienia</NavLink>
              <NavLink to="/profile">Profil</NavLink>
              {isAdmin && <NavLink to="/admin">Panel admina</NavLink>}
            </>
          )}
        </nav>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <Link to="/cart" className="cart-link">
                Koszyk
                {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
              </Link>
              <span className="user-chip">{account?.role}</span>
              <button type="button" className="btn btn-ghost btn-sm" onClick={logout}>
                Wyloguj
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">
                Zaloguj
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Rejestracja
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
