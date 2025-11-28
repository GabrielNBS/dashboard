import type { Metadata, Viewport } from 'next';
import '../styles/global.css';
import MainLayout from '@/components/layout/MainLayout';
import OptimizedProviders from '@/contexts/OptimizedProviders';
import { Inter } from 'next/font/google';
import Script from 'next/script';

const APP_NAME = 'Regula - Sistema de Gestão';
const APP_DESCRIPTION = 'Sistema completo de gestão para seu negócio';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  variable: '--font-inter',
  adjustFontFallback: true,
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(APP_URL),
  // PWA e performance
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_NAME,
  },
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: APP_NAME,
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://cdn.lordicon.com" />
        <link rel="preconnect" href="https://cdn.lordicon.com" crossOrigin="anonymous" />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className={inter.variable}>
        <Script src="https://cdn.lordicon.com/lordicon.js" strategy="lazyOnload" />

        <div id="skip-links" className="sr-only">
          <a href="#main-content" className="skip-link">
            Pular para o conteúdo principal
          </a>
          <a href="#main-navigation" className="skip-link">
            Pular para a navegação
          </a>
        </div>

        <OptimizedProviders>
          <MainLayout>{children}</MainLayout>
        </OptimizedProviders>
      </body>
    </html>
  );
}
