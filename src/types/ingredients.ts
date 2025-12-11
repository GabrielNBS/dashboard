export type UnitType = 'kg' | 'l' | 'un' | 'g' | 'ml';

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
  maxQuantity: number;
  minQuantity?: number;
  // Conversão de unidade (Ex: 1 UN = 395 g)
  weightPerUnit?: number; // Peso/Volume por unidade
  weightUnit?: UnitType; // Unidade do peso (g, ml, kg, l)
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
