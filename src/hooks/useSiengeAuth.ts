import { useState, useCallback, useEffect } from 'react';
import { SiengeAuth } from '../types/sienge';
import siengeClient from '../lib/sienge-client';

interface UseSiengeAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  auth: SiengeAuth | null;
  authenticate: () => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export const useSiengeAuth = (): UseSiengeAuthReturn => {
  const [auth, setAuth] = useState<(SiengeAuth & { timestamp: number }) | null>(() => {
    // Tentar recuperar token do localStorage
    const stored = localStorage.getItem('sienge_auth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Verificar se o token não expirou
        const expiryTime = parsed.timestamp + (parsed.expires_in * 1000);
        if (Date.now() < expiryTime) {
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

  const authenticate = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const authData = await siengeClient.authenticate();
      
      // Adicionar timestamp para cálculo de expiração
      const authWithTimestamp = {
        ...authData,
        timestamp: Date.now(),
      };
      
      setAuth(authWithTimestamp);
      
      // Salvar no localStorage
      localStorage.setItem('sienge_auth', JSON.stringify(authWithTimestamp));
      
      // Configurar refresh automático do token
      const refreshTime = authData.expires_in * 1000 - (5 * 60 * 1000); // 5 minutos antes da expiração
      
      if (refreshTime > 0) {
        setTimeout(() => {
          refreshToken();
        }, refreshTime);
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
    // Limpar token do cliente
    siengeClient['accessToken'] = null;
    siengeClient['tokenExpiry'] = null;
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      await authenticate();
    } catch (err) {
      console.error('Erro ao renovar token:', err);
      logout();
    }
  }, [authenticate, logout]);

  // Verificar se o token expirou ao inicializar
  useEffect(() => {
    if (auth) {
      const expiryTime = auth.timestamp + (auth.expires_in * 1000);
      if (Date.now() >= expiryTime) {
        logout();
      } else {
        // Configurar refresh automático
        const timeUntilExpiry = expiryTime - Date.now();
        const refreshTime = timeUntilExpiry - (5 * 60 * 1000); // 5 minutos antes
        
        if (refreshTime > 0) {
          setTimeout(() => {
            refreshToken();
          }, refreshTime);
        }
      }
    }
  }, [auth, logout, refreshToken]);

  return {
    isAuthenticated: !!auth && siengeClient.isAuthenticated(),
    isLoading,
    error,
    auth,
    authenticate,
    logout,
    refreshToken,
  };
};