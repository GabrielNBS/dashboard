import { Ingredient } from './ingredients';

export interface FixedCost {
  id: string;
  name: string;
  amount: number;
  recurrence: 'mensal' | 'anual';
}

export interface Sale {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  costPrice: number;
  date: string;
  ingredientsUsed: Ingredient[];
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
