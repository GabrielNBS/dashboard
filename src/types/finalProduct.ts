import { Ingredient } from './ingredients';

export interface FinalProductState {
  id: string;
  name: string;
  category: string;
  ingredients: Ingredient[];
}
