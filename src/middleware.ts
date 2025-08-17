import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Obter cookies de autenticação
  const isAuthenticated = request.cookies.get('isAuthenticated')?.value === 'true';
  const userRole = request.cookies.get('userRole')?.value;
  
  // Rotas que não precisam de autenticação
  const publicRoutes = ['/', '/login', '/register', '/planos', '/contato', '/servicos', '/demonstracao', '/doc', '/agentes', '/automacao', '/admin/login'];
  
  // Se for rota pública ou API, permite acesso imediatamente
  if (publicRoutes.includes(pathname) || pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  // Se não estiver autenticado e não for rota pública, redireciona para login
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Se estiver autenticado, verifica permissões específicas
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (userRole !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  if (pathname.startsWith('/dashboard')) {
    if (!['PROFESSIONAL', 'FREE'].includes(userRole || '')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  if (pathname.startsWith('/enterprise')) {
    if (!['COMPANY_ADMIN', 'COMPANY_USER'].includes(userRole || '')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // Se passou por todas as verificações, permite acesso
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};