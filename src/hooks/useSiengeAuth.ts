import { useState, useCallback } from 'react';
import { SiengeAuth } from '../types/sienge';
import siengeClient from '../lib/sienge-client';

interface UseSiengeAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  auth: SiengeAuth | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export const useSiengeAuth = (): UseSiengeAuthReturn => {
  const [auth, setAuth] = useState<SiengeAuth | null>(() => {
    // Tentar recuperar token do localStorage
    const stored = localStorage.getItem('sienge_auth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Verificar se o token não expirou
        if (new Date(parsed.expiresAt) > new Date()) {
          return parsed;
        }
      } catch {
        // Ignorar erro de parsing
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const authData = await siengeClient.authenticate(username, password);
      setAuth(authData);
      
      // Salvar no localStorage
      localStorage.setItem('sienge_auth', JSON.stringify(authData));
      
      // Configurar refresh automático do token
      const expiresAt = new Date(authData.expiresAt);
      const now = new Date();
      const timeUntilExpiry = expiresAt.getTime() - now.getTime();
      
      // Refresh 5 minutos antes da expiração
      if (timeUntilExpiry > 300000) {
        setTimeout(() => {
          refreshToken();
        }, timeUntilExpiry - 300000);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro na autenticação';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setAuth(null);
    localStorage.removeItem('sienge_auth');
  }, []);

  const refreshToken = useCallback(async () => {
    if (!auth) return;

    try {
      // Implementar refresh do token se a API suportar
      // Por enquanto, apenas fazemos logout
      logout();
    } catch (err) {
      console.error('Erro ao renovar token:', err);
      logout();
    }
  }, [auth, logout]);

  return {
    isAuthenticated: !!auth,
    isLoading,
    error,
    auth,
    login,
    logout,
    refreshToken,
  };
};