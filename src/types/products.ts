import { Ingredient } from './ingredients';

type ProductionMode = 'individual' | 'lote';

export interface ProductState {
  uid: string; // identificador único do produto
  name: string;
  category: string;
  productionMode: ProductionMode;
  yieldQuantity?: number;
  totalCost?: number; // custo total dos ingredientes
  sellingPrice?: number; // preço de venda sugerido
  profitMargin?: number; // margem de lucro customizada
  ingredients: Ingredient[];
}
