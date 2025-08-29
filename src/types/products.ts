import { Ingredient } from './ingredients';

export type ProductionMode = 'individual' | 'lote';

export interface ProductionModel {
  mode: ProductionMode; // individual | lote
  yieldQuantity: number; // se for 'individual', default = 1
  totalCost: number; // custo total (lote ou individual)
  unitCost: number; // custo por unidade (derivado do totalCost / yieldQuantity)
  unitSellingPrice: number; // preço de venda unitário
  unitMargin: number; // margem unitária (%)
  sellingPrice: number; // preço de venda total (se for lote)
  profitMargin: number; // margem total (%)
}

export interface ProductState {
  uid: string;
  name: string;
  category: string;
  production: ProductionModel; // tudo consolidado aqui
  ingredients: Ingredient[];
}
