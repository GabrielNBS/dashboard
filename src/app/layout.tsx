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
  display: 'swap',
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} `}>
        <Script src="https://cdn.lordicon.com/lordicon.js" strategy="beforeInteractive" />
        {/* Provider do sistema de toast */}
        <ToastProvider>
          <TooltipProvider>
            <ToastGlobalRegister />
            {/* Provider do contexto de ingredientes */}
            <IngredientProvider>
              {/* Provider do contexto de construção de produtos */}
              <ProductBuilderProvider>
                {/* Provider do contexto de produtos finais */}
                <ProductProvider>
                  {/* Provider do contexto de vendas */}
                  <SalesProvider>
                    {/* Provider do contexto de configurações */}
                    <SettingsProvider>
                      {/* Layout principal com sidebar colapsável */}
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
