import { Ingredient } from './ingredients';

type ProductionMode = 'individual' | 'lote';

export interface ProductState {
  uid: string;
  name: string;
  category: string;
  productionMode: ProductionMode;
  yieldQuantity?: number;
  totalCost: number;
  sellingPrice: number;
  profitMargin?: number;
  ingredients: Ingredient[];
}
