// components/ui/SearchInput.tsx
'use client';

import { SearchableInputProps } from '@/types/components';
import { useState, useEffect } from 'react';
import { Input } from './base';
import { cn } from '@/utils/utils';

export default function SearchableInput<T>({
  items,
  onSelectItem,
  displayAttribute,
  placeholder = 'Buscar...',
  className = '',
  onInputChange,
  inputValue = '',
  label,
  error,
  size = 'md',
  dropUp,
}: SearchableInputProps<T> & {
  label?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  dropUp?: boolean;
}) {
  const [localValue, setLocalValue] = useState(inputValue);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputId = `searchable-input-${Math.random().toString(36).substr(2, 9)}`;
  const listboxId = `${inputId}-listbox`;

  useEffect(() => {
    setLocalValue(inputValue);
  }, [inputValue]);

  const safeItems = Array.isArray(items) ? items : [];
  const safeLocalValue = localValue || '';

  const filteredItems = safeItems.filter(item =>
    item && item[displayAttribute]
      ? String(item[displayAttribute]).toLowerCase().includes(safeLocalValue.toLowerCase())
      : false
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalValue(value);
    setIsOpen(value.length > 0);
    setActiveIndex(-1);
    if (onInputChange) onInputChange(value);
  };

  const handleSelect = (item: T) => {
    if (onSelectItem) {
      onSelectItem(item);
    }
    setLocalValue('');
    setIsOpen(false);
    setActiveIndex(-1);
    if (onInputChange) onInputChange('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => (prev < filteredItems.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && filteredItems[activeIndex]) {
          handleSelect(filteredItems[activeIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-foreground mb-1 block text-sm font-medium">
          {label}
        </label>
      )}

      <div className={cn('relative', className)}>
        <Input
          id={inputId}
          type="text"
          placeholder={placeholder}
          value={localValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          error={error}
          size={size}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-owns={isOpen ? listboxId : undefined}
          aria-activedescendant={
            activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
          }
          aria-describedby={error ? `${inputId}-error` : undefined}
          autoComplete="off"
        />

        {isOpen && localValue && (
          <ul
            id={listboxId}
            className={cn(
              'bg-popover border-border absolute z-10 w-full overflow-y-auto rounded-lg border shadow-lg',
              dropUp ? 'bottom-full mb-1 max-h-48' : 'mt-1 max-h-60'
            )}
            role="listbox"
            aria-label="Opções de busca"
          >
            {filteredItems.map((item, index) => (
              <li
                key={index}
                id={`${listboxId}-option-${index}`}
                onClick={() => handleSelect(item)}
                className={`cursor-pointer px-4 py-2 transition-colors ${
                  index === activeIndex ? 'bg-muted' : 'hover:bg-muted'
                }`}
                role="option"
                aria-selected={index === activeIndex}
              >
                {String(item[displayAttribute])}
              </li>
            ))}
            {filteredItems.length === 0 && (
              <li
                className="text-muted-foreground px-4 py-2 text-sm"
                role="option"
                aria-selected={false}
              >
                Nenhum item encontrado
              </li>
            )}
          </ul>
        )}
      </div>

      {error && (
        <span id={`${inputId}-error`} className="text-destructive text-sm font-medium" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
