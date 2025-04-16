import CardBase from '@/components/atoms/CardBase';
import { Title } from '@/components/atoms/Text';
import CardFinance from '@/components/molecules/CardFinance';

export default function DashboardPage() {
  return (
    <>
      <Title>Bem-vindo ao Dashboard!</Title>
      <CardFinance />
    </>
  );
}
