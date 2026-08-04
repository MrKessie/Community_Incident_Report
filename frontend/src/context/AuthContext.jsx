import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import apiClient from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    localStorage.removeItem('auth_token');
    setUser(null);
  }, []);

  useEffect(() => {
    async function hydrateUser() {
      const token = localStorage.getItem('auth_token');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient.get('/auth/me');
        setUser(response.data.user);
      } catch {
        clearSession();
      } finally {
        setLoading(false);
      }
    }

    hydrateUser();
  }, [clearSession]);

  useEffect(() => {
    function handleAuthExpired() {
      clearSession();
    }

    window.addEventListener('auth:expired', handleAuthExpired);

    return () => {
      window.removeEventListener('auth:expired', handleAuthExpired);
    };
  }, [clearSession]);

  const value = useMemo(
    () => ({
      user,
      setUser,
      clearSession,
      loading,
      isAuthenticated: Boolean(user),
    }),
    [user, loading, clearSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
