import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Alert, FieldError } from '../components/ui';
import { inputClassName, partitionErrors } from '../utils/errors';

export default function RegisterPage() {
  const { register, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const { fields } = partitionErrors(error);

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

        <Alert error={error} onClose={clearError} />
        {password !== confirm && confirm && (
          <Alert message="Hasła nie są identyczne." />
        )}

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
              autoComplete="new-password"
              className={inputClassName('input', fields, 'password')}
            />
            <FieldError message={fields.password} />
          </label>
          <label>
            Powtórz hasło
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
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
