import { Ingredient } from './ingredients';

export interface Sale {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  costPrice: number;
  date: string;
  ingredientsUsed: Ingredient[];
}
