import type { Metadata, Viewport } from 'next';
import '../styles/global.css';
import MainLayout from '@/components/layout/MainLayout';
import { IngredientProvider } from '@/contexts/Ingredients/IngredientsContext';
import { ProductBuilderProvider } from '@/contexts/products/ProductBuilderContext';
import { ProductProvider } from '@/contexts/products/ProductContext';
import { SalesProvider } from '@/contexts/sales/SalesContext';
import { SettingsProvider } from '@/contexts/settings/SettingsContext';
import { ToastProvider, ToastGlobalRegister } from '@/components/ui/feedback/use-toast';
import { Inter } from 'next/font/google';
import { TooltipProvider } from '@/components/ui/feedback/tooltip';
import Script from 'next/script';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Melhora performance de font loading
  preload: true,
  fallback: ['system-ui', 'arial'],
  variable: '--font-inter',
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
    default: 'Sistema de Gestão',
    template: '%s | Sistema de Gestão',
  },
  description: 'Sistema completo de gestão para seu negócio',
  metadataBase: new URL('https://localhost:3000'),
  // PWA e performance
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Sistema de Gestão',
  },
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Sistema de Gestão',
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
        <link rel="prefetch" href="/store" as="document" />
        <link rel="prefetch" href="/product" as="document" />
        <link rel="prefetch" href="/finance" as="document" />
        <link rel="prefetch" href="/pdv" as="document" />
        <link rel="prefetch" href="/settings" as="document" />
      </head>
      <body className={`${inter.variable} `}>
        <Script src="https://cdn.lordicon.com/lordicon.js" strategy="beforeInteractive" />
        <div id="skip-links" className="sr-only">
          <a href="#main-content" className="skip-link">
            Pular para o conteúdo principal
          </a>
          <a href="#main-navigation" className="skip-link">
            Pular para a navegação
          </a>
        </div>
        <ToastProvider>
          <TooltipProvider>
            <ToastGlobalRegister />
            <IngredientProvider>
              <ProductBuilderProvider>
                <ProductProvider>
                  <SalesProvider>
                    <SettingsProvider>
                      <MainLayout>{children}</MainLayout>
                    </SettingsProvider>
                  </SalesProvider>
                </ProductProvider>
              </ProductBuilderProvider>
            </IngredientProvider>
          </TooltipProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
