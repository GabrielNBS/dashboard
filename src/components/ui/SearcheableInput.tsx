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
}: SearchableInputProps<T> & {
  label?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const [localValue, setLocalValue] = useState(inputValue);

  useEffect(() => {
    setLocalValue(inputValue);
  }, [inputValue]);

  const filteredItems = items.filter(item =>
    String(item[displayAttribute]).toLowerCase().includes(localValue.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalValue(value);
    if (onInputChange) onInputChange(value);
  };

  const handleSelect = (item: T) => {
    if (onSelectItem) {
      onSelectItem(item);
    }
    setLocalValue('');
    if (onInputChange) onInputChange('');
  };

  return (
    <div className="flex flex-col gap-1">
      {/* Label do campo */}
      {label && <label className="text-foreground mb-1 block text-sm font-medium">{label}</label>}

      <div className={cn('relative', className)}>
        <Input
          type="text"
          placeholder={placeholder}
          value={localValue}
          onChange={handleChange}
          error={error}
          size={size}
        />

        {localValue && (
          <ul className="bg-popover border-border absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border shadow-lg">
            {filteredItems.map((item, index) => (
              <li
                key={index}
                onClick={() => handleSelect(item)}
                className="hover:bg-muted cursor-pointer px-4 py-2 transition-colors"
              >
                {String(item[displayAttribute])}
              </li>
            ))}
            {filteredItems.length === 0 && (
              <li className="text-muted-foreground px-4 py-2 text-sm">Nenhum item encontrado</li>
            )}
          </ul>
        )}
      </div>

      {/* Mensagem de erro */}
      {error && <span className="text-destructive text-sm font-medium">{error}</span>}
    </div>
  );
}
