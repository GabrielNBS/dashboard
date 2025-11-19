import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Centralize as rotas bloqueadas aqui
const BLOCKED_ROUTES = ['/logout'] as const;

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProduction = process.env.NODE_ENV === 'production';

  // Bloqueia apenas em produção
  if (isProduction) {
    const isBlocked = BLOCKED_ROUTES.some(
      route => pathname === route || pathname.startsWith(`${route}/`)
    );

    if (isBlocked) {
      // Retorna 404 sem redirect (melhor performance)
      return new NextResponse(null, { status: 404 });
    }
  }

  return NextResponse.next();
}

export const config = {
  // Matcher otimizado para apenas as rotas necessárias
  matcher: ['/logout/:path*', '/admin/usuarios/:path*', '/configuracoes/avancado/:path*'],
};
