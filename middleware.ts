import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Headers de performance
  response.headers.set('X-DNS-Prefetch-Control', 'on');

  // Early hints para prefetch (se suportado)
  const pathname = request.nextUrl.pathname;

  // Adiciona hints de prefetch para rotas relacionadas
  if (pathname === '/') {
    response.headers.set(
      'Link',
      '</store>; rel=prefetch, </product>; rel=prefetch, </finance>; rel=prefetch, </pdv>; rel=prefetch, </settings>; rel=prefetch'
    );
  } else if (pathname === '/store') {
    response.headers.set('Link', '</product>; rel=prefetch, </finance>; rel=prefetch');
  } else if (pathname === '/product') {
    response.headers.set('Link', '</store>; rel=prefetch, </pdv>; rel=prefetch');
  } else if (pathname === '/finance') {
    response.headers.set('Link', '</store>; rel=prefetch, </product>; rel=prefetch');
  } else if (pathname === '/pdv') {
    response.headers.set('Link', '</product>; rel=prefetch, </store>; rel=prefetch');
  } else if (pathname === '/settings') {
    response.headers.set('Link', '</store>; rel=prefetch, </product>; rel=prefetch');
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
