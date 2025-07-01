import '../styles/global.css';
import Aside from '@/components/dashboard/home/Aside';
import { IngredientProvider } from '@/contexts/IngredientContext';
import { ProductBuilderProvider } from '@/contexts/ProductBuilderContext';
import { FinalProductListProvider } from '@/contexts/FinalProductListContext';
import { SalesProvider } from '@/contexts/SalesContext';
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
            <FinalProductListProvider>
              <SalesProvider>
                <div className={`antialiased sm:grid sm:grid-cols-[15%_85%]`}>
                  <MobileHeader />
                  <Aside />
                  <main className="outline-accent h-dvh min-h-dvh w-full px-4 outline-1 transition-all">
                    {children}
                  </main>
                </div>
              </SalesProvider>
            </FinalProductListProvider>
          </ProductBuilderProvider>
        </IngredientProvider>
      </body>
    </html>
  );
}
