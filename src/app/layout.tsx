import '../styles/global.css';
import Aside from '@/components/dashboard/home/Aside';
import { IngredientProvider } from '@/contexts/Ingredients/IngredientsContext';
import { ProductBuilderProvider } from '@/contexts/products/ProductBuilderContext';
import { FinalProductProvider } from '@/contexts/products/FinalProductContext';
import { SalesProvider } from '@/contexts/sales/SalesContext';
import MobileHeader from '@/components/mobile/MobileHeader';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <IngredientProvider>
          <ProductBuilderProvider>
            <FinalProductProvider>
              <SalesProvider>
                <div className={`antialiased sm:grid sm:grid-cols-[15%_85%]`}>
                  <MobileHeader />
                  <Aside />
                  <main className="outline-accent h-dvh min-h-dvh w-full px-4 outline-1 transition-all">
                    {children}
                  </main>
                </div>
              </SalesProvider>
            </FinalProductProvider>
          </ProductBuilderProvider>
        </IngredientProvider>
      </body>
    </html>
  );
}
