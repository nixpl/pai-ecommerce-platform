import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authApi from '../api/auth';
import { getStoredToken, setStoredToken } from '../api/client';
import { toErrorState } from '../utils/errors';
import { decodeJwtPayload, isTokenExpired } from '../utils/jwt';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const stored = getStoredToken();
    if (stored && !isTokenExpired(stored)) return stored;
    if (stored) setStoredToken(null);
    return null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const account = useMemo(() => {
    if (!token) return null;
    const payload = decodeJwtPayload(token);
    if (!payload) return null;
    return { id: payload.id, role: payload.role };
  }, [token]);

  const isAdmin = account?.role === 'admin' || account?.role === 'super_admin';

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { token: newToken } = await authApi.login(email, password);
      setStoredToken(newToken);
      setToken(newToken);
      return true;
    } catch (err) {
      setError(toErrorState(err));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      await authApi.register(email, password);
      return await login(email, password);
    } catch (err) {
      setError(toErrorState(err));
      return false;
    } finally {
      setLoading(false);
    }
  }, [login]);

  const logout = useCallback(() => {
    setStoredToken(null);
    setToken(null);
    setError(null);
  }, []);

  useEffect(() => {
    if (token && isTokenExpired(token)) {
      logout();
    }
  }, [token, logout]);

  useEffect(() => {
    const handleAuthExpired = () => logout();
    window.addEventListener('pai:auth-expired', handleAuthExpired);
    return () => window.removeEventListener('pai:auth-expired', handleAuthExpired);
  }, [logout]);

  const value = {
    token,
    account,
    isAuthenticated: Boolean(token && account),
    isAdmin,
    loading,
    error,
    login,
    register,
    logout,
    clearError: () => setError(null)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
