import React from 'react';
import { Ingredient } from './ingredients';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'accept' | 'edit' | 'destructive' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  tooltip?: {
    tooltipContent: string;
  };
};

export interface FormErrorProps {
  message?: string;
  className?: string;
}

export interface NumericInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  quickIncrements?: number[];
}

export type SearchableInputProps<T> = {
  items: T[];
  onSelectItem?: (item: T) => void;
  displayAttribute: keyof T;
  placeholder?: string;
  className?: string;
  onInputChange?: (value: string) => void;
  inputValue?: string;
};

export type StatusFilter = 'critico' | 'atencao' | 'normal' | 'all';

export interface IngredientCardProps {
  ingredient: Ingredient;
  onEdit: (ingredient: Ingredient) => void;
  onDelete: (ingredientId: string) => void;
}
