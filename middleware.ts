import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Headers de performance
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Cache control para assets estáticos
  const pathname = request.nextUrl.pathname;
  
  if (pathname.startsWith('/_next/static/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  // Remover prefetch excessivo - Next.js já faz isso automaticamente
  // Apenas adicionar para a home page
  if (pathname === '/') {
    response.headers.set('Link', '</store>; rel=prefetch');
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
