import { ProductState } from './products';
export interface Sale extends ProductState {
  id: string;
  date: string;
}
