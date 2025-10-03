// components/ui/SearchInput.tsx
'use client';

import { SearchableInputProps } from '@/types/components';
import { useState, useEffect } from 'react';
import { Input } from './base';

export default function SearchableInput<T>({
  items,
  onSelectItem,
  displayAttribute,
  placeholder = 'Buscar...',
  className = '',
  onInputChange,
  inputValue = '',
}: SearchableInputProps<T>) {
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
    <div className={`relative ${className}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={localValue}
        onChange={handleChange}
        className="w-full rounded border p-2"
      />

      {localValue && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded bg-white shadow-lg">
          {filteredItems.map((item, index) => (
            <li
              key={index}
              onClick={() => handleSelect(item)}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100"
            >
              {String(item[displayAttribute])}
            </li>
          ))}
          {filteredItems.length === 0 && (
            <li className="px-4 py-2 text-sm text-gray-400">Nenhum item encontrado</li>
          )}
        </ul>
      )}
    </div>
  );
}
