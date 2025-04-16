import DashboardHeader from '@/components/organisms/DashboardHeader';
import '../styles/global.css';
import DashboardAside from '@/components/molecules/DashboardAside';
import MainSection from '@/components/templates/MainSection';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`antialiased`}>
        <DashboardHeader />
        <DashboardAside />
        <MainSection>{children}</MainSection>
      </body>
    </html>
  );
}
