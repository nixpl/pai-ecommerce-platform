import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/ui';

export default function RegisterPage() {
  const { register, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (password !== confirm) {
      return;
    }

    const ok = await register(email, password);
    if (ok) navigate('/');
  };

  return (
    <div className="page auth-page">
      <div className="auth-card">
        <h1>Rejestracja</h1>
        <p className="auth-sub">Utwórz konto klienta w serwisie auth-service.</p>

        <Alert message={error} onClose={clearError} />
        {password !== confirm && confirm && (
          <Alert message="Hasła nie są identyczne." />
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            E-mail
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="input"
            />
          </label>
          <label>
            Hasło
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              className="input"
            />
          </label>
          <label>
            Powtórz hasło
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="input"
            />
          </label>
          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading || password !== confirm}
          >
            {loading ? 'Rejestracja…' : 'Zarejestruj się'}
          </button>
        </form>

        <p className="auth-footer">
          Masz już konto? <Link to="/login">Zaloguj się</Link>
        </p>
      </div>
    </div>
  );
}
