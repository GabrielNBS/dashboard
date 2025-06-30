export type UnitType = 'kg' | 'g' | 'l' | 'ml' | 'unidade';

export type Ingredient = {
  id: number;
  name: string;
  buyPrice?: number;
  quantity: number;
  unit: UnitType;
  stockStatus?: 'Em estoque' | 'Sem estoque' | 'Estoque baixo';
  totalValue: number;
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
