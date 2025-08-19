import React from 'react';

/**
 * Props do componente Button
 *
 * Estende as propriedades nativas do elemento button HTML
 * e adiciona propriedades customizadas para variantes e tamanhos.
 */
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
