import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSiengeAuth } from '@/hooks/useSiengeAuth';
import { SiengeLogin } from './SiengeLogin';
import { SiengeDashboard } from './SiengeDashboard';

// Criar uma instância do QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

export const SiengeApp: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SiengeAppContent />
    </QueryClientProvider>
  );
};

const SiengeAppContent: React.FC = () => {
  const { isAuthenticated } = useSiengeAuth();

  if (!isAuthenticated) {
    return <SiengeLogin />;
  }

  return <SiengeDashboard />;
};