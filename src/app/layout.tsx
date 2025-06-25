import DashboardHeader from '@/components/organisms/DashboardHeader';
import '../styles/global.css';
import DashboardAside from '@/components/molecules/DashboardAside';
import MainSection from '@/components/organisms/Main';
import { IngredientProvider } from '@/contexts/IngredientContext';
import { ProductBuilderProvider } from '@/contexts/ProductBuilderContext';
import { FinalProductListProvider } from '@/contexts/FinalProductListContext';
import { SalesProvider } from '@/contexts/SalesContext';

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
                  <DashboardHeader />
                  <DashboardAside />
                  <MainSection>{children}</MainSection>
                </div>
              </SalesProvider>
            </FinalProductListProvider>
          </ProductBuilderProvider>
        </IngredientProvider>
      </body>
    </html>
  );
}
