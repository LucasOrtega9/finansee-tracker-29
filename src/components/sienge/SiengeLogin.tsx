import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Building2, CheckCircle } from 'lucide-react';
import { useSiengeAuth } from '@/hooks/useSiengeAuth';

interface SiengeLoginProps {
  onLoginSuccess?: () => void;
}

export const SiengeLogin: React.FC<SiengeLoginProps> = ({ onLoginSuccess }) => {
  const { authenticate, isLoading, error, isAuthenticated } = useSiengeAuth();

  const handleAuthenticate = async () => {
    try {
      await authenticate();
      onLoginSuccess?.();
    } catch (err) {
      // Erro já é tratado pelo hook
    }
  };

  // Se já estiver autenticado, mostrar mensagem de sucesso
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Autenticado!
            </CardTitle>
            <CardDescription className="text-gray-600">
              Conectado com sucesso à API do Sienge
            </CardDescription>
          </CardHeader>
          
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Suas credenciais foram validadas e você está conectado.
            </p>
            <Button onClick={onLoginSuccess} className="w-full">
              Continuar para o Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Sienge API
          </CardTitle>
          <CardDescription className="text-gray-600">
            Conecte-se à API do Sienge para acessar os dados financeiros
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Este sistema usa autenticação OAuth2 com suas credenciais de cliente.
              </p>
              <p className="text-xs text-gray-500">
                Certifique-se de que as variáveis de ambiente estão configuradas:
                <br />
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                  VITE_SIENGE_CLIENT_ID e VITE_SIENGE_CLIENT_SECRET
                </code>
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleAuthenticate}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Conectando...
                </>
              ) : (
                'Conectar à API do Sienge'
              )}
            </Button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              Clique no botão acima para autenticar com suas credenciais de cliente.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};