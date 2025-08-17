'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, Building, User, Shield } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userType, setUserType] = useState<'admin' | 'company' | 'client'>('admin')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/admin/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, userType }),
      })

      const data = await response.json()

      if (response.ok) {
        // Store token in localStorage for client-side auth
        localStorage.setItem('auth-token', data.token)
        localStorage.setItem('user-role', data.user.role)
        
        // Redirect based on user role
        if (data.user.role === 'admin') {
          router.push('/admin')
        } else if (data.user.role === 'company_admin') {
          router.push('/admin/company')
        } else {
          router.push('/admin')
        }
      } else {
        setError(data.error || 'Erro ao fazer login')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Zanai Project</CardTitle>
          <CardDescription>
            Sistema de Gestão de IA e Desenvolvimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Main action buttons */}
            <div className="space-y-3">
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => {
                  setUserType('client');
                  // Focus on email input after selection
                  document.getElementById('email')?.focus();
                }}
              >
                <User className="w-4 h-4 mr-2" />
                Já sou cliente
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full" 
                size="lg"
                onClick={() => {
                  // For now, set to client and show registration form
                  setUserType('client');
                  document.getElementById('email')?.focus();
                }}
              >
                <User className="w-4 h-4 mr-2" />
                Cadastre-se
              </Button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Ou
                </span>
              </div>
            </div>

            {/* Admin access */}
            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setUserType('admin');
                  document.getElementById('email')?.focus();
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <Shield className="w-4 h-4 mr-1" />
                Acesso administrativo
              </Button>
            </div>
          </div>

          {/* Login form - shown when user type is selected */}
          {(userType === 'client' || userType === 'admin') && (
            <form onSubmit={handleLogin} className="space-y-4 mt-6">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Acessando...' : 'Acessar Sistema'}
              </Button>
            </form>
          )}
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Acesso restrito a usuários autorizados</p>
            <p className="mt-1">Entre em contato com o administrador para solicitar acesso</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}