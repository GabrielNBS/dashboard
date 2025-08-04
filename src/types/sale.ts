import { FinalProductState } from './finalProduct';

export interface FixedCost {
  id: string;
  name: string;
  amount: number;
  recurrence: 'mensal' | 'anual';
}

export interface Sale extends FinalProductState {
  id: string;
  date: string;
}

export interface CardFinanceProps {
  totalRevenue: number;
  totalVariableCost: number;
  totalFixedCost: number;
  grossProfit: number;
  netProfit: number;
  margin: number;
  valueToSave: number;
}
