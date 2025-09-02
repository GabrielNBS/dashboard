export type UnitType = 'kg' | 'l' | 'un';

export type PurchaseBatch = {
  id: string;
  purchaseDate: Date;
  buyPrice: number; // preço total pago nesta compra
  originalQuantity: number; // quantidade original comprada
  currentQuantity: number; // quantidade atual restante
  unitPrice: number; // preço por unidade base desta compra
  supplier?: string;
};

export type Ingredient = {
  id: string;
  name: string;
  unit: UnitType;
  totalQuantity: number; // Quantidade total atual (soma de todos os batches)
  averageUnitPrice: number; // Preço médio ponderado atual
  batches: PurchaseBatch[]; // Histórico de compras (batches)
  maxQuantity?: number;
};

export type IngredientTableProps = {
  ingredients: Ingredient[];
  onDeleteIngredient: (ingredient: Ingredient) => void;
  onEditIngredient: (ingredient: Ingredient) => void;
};

export type IngredientEditModalProps = {
  ingredient: Ingredient;
  isOpen: boolean;
  onSave: (ingredient: Ingredient) => void;
  onClose: () => void;
};
