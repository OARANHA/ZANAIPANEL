'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, Building, User, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Login attempt:', { email, password });
      
      // Limpar cookies existentes primeiro
      document.cookie = 'isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'userEmail=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      
      // Simulação de login - em produção, integrar com backend real
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Lógica de redirecionamento baseada no tipo de usuário
      if (email.includes('empresa') || email.includes('corporation')) {
        // Empresa
        console.log('Setting COMPANY_ADMIN role');
        document.cookie = 'isAuthenticated=true; path=/; max-age=86400; SameSite=Lax; Secure';
        document.cookie = `userEmail=${encodeURIComponent(email)}; path=/; max-age=86400; SameSite=Lax; Secure`;
        document.cookie = `userRole=COMPANY_ADMIN; path=/; max-age=86400; SameSite=Lax; Secure`;
        
        // Verificar se os cookies foram definidos
        setTimeout(() => {
          console.log('Cookies after setting:', document.cookie);
          console.log('Redirecting to /enterprise');
          window.location.href = '/enterprise';
        }, 100);
      } else if (email.includes('funcionario') || email.includes('employee')) {
        // Funcionário
        console.log('Setting COMPANY_USER role');
        document.cookie = 'isAuthenticated=true; path=/; max-age=86400; SameSite=Lax; Secure';
        document.cookie = `userEmail=${encodeURIComponent(email)}; path=/; max-age=86400; SameSite=Lax; Secure`;
        document.cookie = `userRole=COMPANY_USER; path=/; max-age=86400; SameSite=Lax; Secure`;
        
        // Verificar se os cookies foram definidos
        setTimeout(() => {
          console.log('Cookies after setting:', document.cookie);
          console.log('Redirecting to /enterprise/user');
          window.location.href = '/enterprise/user';
        }, 100);
      } else {
        // Usuário individual
        console.log('Setting PROFESSIONAL role');
        document.cookie = 'isAuthenticated=true; path=/; max-age=86400; SameSite=Lax; Secure';
        document.cookie = `userEmail=${encodeURIComponent(email)}; path=/; max-age=86400; SameSite=Lax; Secure`;
        document.cookie = `userRole=PROFESSIONAL; path=/; max-age=86400; SameSite=Lax; Secure`;
        
        // Verificar se os cookies foram definidos
        setTimeout(() => {
          console.log('Cookies after setting:', document.cookie);
          console.log('Redirecting to /dashboard');
          window.location.href = '/dashboard';
        }, 100);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('E-mail ou senha incorretos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Brain className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Zanai
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Plataforma de Agentes de IA
          </p>
        </div>

        <Card className="bg-white dark:bg-slate-800 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Entrar</CardTitle>
            <CardDescription>
              Acesse sua conta para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-slate-800 text-gray-500">
                    Ou acesse como
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    setEmail('admin@mix.com');
                    setPassword('empresa');
                  }}
                >
                  <Building className="w-4 h-4 mr-2" />
                  Admin Empresa
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    setEmail('funcionario@mix.com');
                    setPassword('empresa');
                  }}
                >
                  <User className="w-4 h-4 mr-2" />
                  Funcionário
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    setEmail('usuario@zanai.com');
                    setPassword('profissional');
                  }}
                >
                  <User className="w-4 h-4 mr-2" />
                  Usuário Profissional
                </Button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Não tem uma conta?{' '}
                <a href="/register" className="text-blue-600 hover:text-blue-500">
                  Registre-se
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Dicas de acesso */}
        <div className="mt-6 text-xs text-gray-500 text-center">
          <p>
            <strong>Dicas para teste:</strong><br />
            • Use os botões acima para acesso rápido<br />
            • Empresa → /enterprise<br />
            • Usuário → /dashboard
          </p>
        </div>
      </div>
    </div>
  );
}