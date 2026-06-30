import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Alert, FieldError } from '../components/ui';
import { inputClassName, partitionErrors } from '../utils/errors';

export default function LoginPage() {
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { fields } = partitionErrors(error);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    const ok = await login(email, password);
    if (ok) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="page auth-page">
      <div className="auth-card">
        <h1>Zaloguj się</h1>

        <Alert error={error} onClose={clearError} />

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <label>
            E-mail
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className={inputClassName('input', fields, 'email')}
            />
            <FieldError message={fields.email} />
          </label>
          <label>
            Hasło
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className={inputClassName('input', fields, 'password')}
            />
            <FieldError message={fields.password} />
          </label>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Logowanie…' : 'Zaloguj'}
          </button>
        </form>

        <p className="auth-footer">
          Nie masz konta? <Link to="/register">Zarejestruj się</Link>
        </p>
      </div>
    </div>
  );
}
