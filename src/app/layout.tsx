import '../styles/global.css';
import Aside from '@/components/dashboard/home/Aside';
import { IngredientProvider } from '@/contexts/Ingredients/IngredientsContext';
import { ProductBuilderProvider } from '@/contexts/products/ProductBuilderContext';
import { ProductProvider } from '@/contexts/products/ProductContext';
import { SalesProvider } from '@/contexts/sales/SalesContext';
import { SettingsProvider } from '@/contexts/settings/SettingsContext';
import MobileHeader from '@/components/mobile/MobileHeader';
import { ToastProvider, ToastGlobalRegister } from '@/components/ui/use-toast';
import { Inter } from 'next/font/google';

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
        {/* Provider do sistema de toast */}
        <ToastProvider>
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
                    {/* Layout principal com grid responsivo */}
                    <div className={`antialiased sm:grid sm:grid-cols-[15%_85%]`}>
                      {/* Header mobile para dispositivos pequenos */}
                      <MobileHeader />

                      {/* Sidebar com navegação */}
                      <Aside />

                      {/* Área principal de conteúdo */}
                      <main className="outline-accent h-dvh min-h-dvh w-full px-4 outline-1 transition-all">
                        {children}
                      </main>
                    </div>
                  </SettingsProvider>
                </SalesProvider>
              </ProductProvider>
            </ProductBuilderProvider>
          </IngredientProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
