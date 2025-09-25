// ============================================================
// 🔹 Generic Form Utilities
// ============================================================
// Reusable form components and utilities to eliminate duplication
// across ProductForm, IngredientForm, and other form components

import React from 'react';
import { toast } from '@/components/ui/feedback/use-toast';
import Button from '@/components/ui/base/Button';
import { CheckCheck, X } from 'lucide-react';

// Validation message configuration
export interface ValidationMessage {
  title: string;
  description: string;
}

// Common validation messages
export const COMMON_VALIDATION_MESSAGES = {
  REQUIRED_FIELDS: {
    title: 'Campos obrigatórios',
    description: 'Preencha todos os campos obrigatórios.',
  },
  INVALID_PRICE: {
    title: 'Preço inválido',
    description: 'Informe um preço válido.',
  },
  INVALID_QUANTITY: {
    title: 'Quantidade inválida',
    description: 'Informe uma quantidade válida.',
  },
  DUPLICATE_ITEM: {
    title: 'Item duplicado',
    description: 'Já existe um item com essas informações.',
  },
  SAVE_SUCCESS: {
    title: 'Salvo com sucesso!',
    description: 'As alterações foram salvas.',
  },
  UPDATE_SUCCESS: {
    title: 'Atualizado com sucesso!',
    description: 'O item foi atualizado.',
  },
} as const;

// Form field configuration
export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  placeholder?: string;
  required?: boolean;
  validation?: (value: unknown) => string | null;
  options?: Array<{ value: string; label: string }>; // For select fields
  step?: string; // For number fields
  min?: string; // For number fields
  max?: string; // For number fields
}

// Form action button configuration
export interface FormActionConfig {
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'outline' | 'accept' | 'destructive';
  type?: 'button' | 'submit';
  onClick?: () => void;
}

// Generic form props
export interface GenericFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  isEditMode?: boolean;
  isSubmitting?: boolean;
  editItemName?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Generic form wrapper component
 * Provides consistent form layout and action buttons
 *
 * @param onSubmit - Form submit handler
 * @param onCancel - Cancel button handler
 * @param isEditMode - Whether form is in edit mode
 * @param isSubmitting - Whether form is currently submitting
 * @param editItemName - Name of item being edited (for edit mode banner)
 * @param children - Form content
 * @param className - Additional CSS classes
 */
export function GenericForm({
  onSubmit,
  onCancel,
  isEditMode = false,
  isSubmitting = false,
  editItemName,
  children,
  className = '',
}: GenericFormProps) {
  return (
    <form onSubmit={onSubmit} className={`flex flex-col gap-4 ${className}`}>
      {/* Edit mode banner */}
      {isEditMode && editItemName && (
        <div className="bg-warning text-on-warning mb-4 rounded p-2 text-sm">
          Editando: <strong>{editItemName}</strong> — qualquer alteração será aplicada ao item
          existente.
        </div>
      )}

      {/* Form content */}
      {children}

      {/* Action buttons */}
      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          <X className="h-5 w-5" />
          Cancelar
        </Button>
        <Button type="submit" variant="accept" disabled={isSubmitting}>
          <CheckCheck className="h-5 w-5" />
          {isSubmitting ? 'Salvando...' : isEditMode ? 'Atualizar' : 'Adicionar'}
        </Button>
      </div>
    </form>
  );
}

// ============================================================
// 🔹 Form Field Components
// ============================================================

/**
 * Generic form field component
 * Renders different input types based on configuration
 */
export interface GenericFormFieldProps {
  config: FormFieldConfig;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  disabled?: boolean;
}

export function GenericFormField({
  config,
  value,
  onChange,
  error,
  disabled = false,
}: GenericFormFieldProps) {
  const { name, label, type, placeholder, required, options, step, min, max } = config;

  const baseInputClasses = `w-full rounded border p-2 ${error ? 'border-destructive' : 'border-gray-300'}`;

  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select
            id={name}
            value={value}
            onChange={e => onChange(e.target.value)}
            className={baseInputClasses}
            required={required}
            disabled={disabled}
          >
            <option value="">Selecione...</option>
            {options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <textarea
            id={name}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className={`${baseInputClasses} resize-vertical min-h-[100px]`}
            required={required}
            disabled={disabled}
          />
        );

      case 'number':
        return (
          <input
            type="text"
            id={name}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className={baseInputClasses}
            required={required}
            disabled={disabled}
          />
        );

      case 'text':
      default:
        return (
          <input
            type="text"
            id={name}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className={baseInputClasses}
            required={required}
            disabled={disabled}
          />
        );
    }
  };

  return (
    <div>
      <label htmlFor={name} className="mb-1 block font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      {renderInput()}
      {error && <span className="text-destructive mt-1 block text-sm">{error}</span>}
    </div>
  );
}

// ============================================================
// 🔹 Validation Utilities
// ============================================================

/**
 * Generic validation function
 * Validates form data against field configurations
 *
 * @param data - Form data object
 * @param fields - Array of field configurations
 * @returns Object with validation errors (empty if valid)
 */
export function validateFormData(
  data: Record<string, unknown>,
  fields: FormFieldConfig[]
): Record<string, string> {
  const errors: Record<string, string> = {};

  fields.forEach(field => {
    const value = data[field.name];

    // Required field validation
    if (field.required && (!value || (typeof value === 'string' && !value.trim()))) {
      errors[field.name] = `${field.label} é obrigatório`;
      return;
    }

    // Custom validation
    if (field.validation && value) {
      const validationError = field.validation(value);
      if (validationError) {
        errors[field.name] = validationError;
      }
    }
  });

  return errors;
}

/**
 * Show validation toast
 * Displays validation error messages as toast notifications
 *
 * @param message - Validation message configuration
 */
export function showValidationToast(message: ValidationMessage) {
  toast({
    ...message,
    variant: 'destructive',
  });
}

/**
 * Show success toast
 * Displays success messages as toast notifications
 *
 * @param message - Success message configuration
 */
export function showSuccessToast(message: ValidationMessage) {
  toast({
    ...message,
    variant: 'accept',
  });
}

// ============================================================
// 🔹 Common Validation Functions
// ============================================================

/**
 * Validate required text field
 */
export function validateRequired(value: string): string | null {
  if (!value || !value.trim()) {
    return 'Este campo é obrigatório';
  }
  return null;
}

/**
 * Validate positive number
 */
export function validatePositiveNumber(value: string | number): string | null {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num) || num <= 0) {
    return 'Deve ser um número positivo';
  }
  return null;
}

/**
 * Validate price format
 */
export function validatePrice(value: string | number): string | null {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num) || num < 0) {
    return 'Preço deve ser um valor válido';
  }
  return null;
}

/**
 * Validate email format
 */
export function validateEmail(value: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return 'Email deve ter um formato válido';
  }
  return null;
}
