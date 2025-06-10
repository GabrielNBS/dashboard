import DashboardHeader from '@/components/organisms/DashboardHeader';
import '../styles/global.css';
import DashboardAside from '@/components/molecules/DashboardAside';
import MainSection from '@/components/organisms/Main';
import { ProductProvider } from '@/context/store';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <ProductProvider>
          <div className={`antialiased sm:grid sm:grid-cols-[15%_85%]`}>
            <DashboardHeader />
            <DashboardAside />
            <MainSection>{children}</MainSection>
          </div>
        </ProductProvider>
      </body>
    </html>
  );
}
