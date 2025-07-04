export type UnitType = 'kg' | 'l' | 'un';

export type Ingredient = {
  id: string;
  name: string;
  buyPrice?: number;
  quantity: number;
  unit: UnitType;
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
