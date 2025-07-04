import { Ingredient } from './ingredients';

type ProductionMode = 'individual' | 'lote';

export interface FinalProductState {
  uid: string; // identificador único do produto
  id: string;
  name: string;
  category: string;
  productionMode: ProductionMode;
  yieldQuantity?: number;
  ingredients: Ingredient[];
}
