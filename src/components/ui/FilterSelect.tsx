// components/ui/FilterSelect.tsx
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './forms/select';

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  label?: string;
  placeholder?: string;
  'aria-label'?: string;
}

const FilterSelect: React.FC<FilterSelectProps> = ({
  value,
  onChange,
  options,
  label,
  placeholder = 'Selecione uma opção',
  'aria-label': ariaLabel,
}) => {
  const selectId = `filter-select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={selectId} className="text-foreground text-sm font-medium">
          {label}
        </label>
      )}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          id={selectId}
          className="border-input bg-background focus:border-primary focus:ring-ring block w-full rounded-md border py-2 pr-10 pl-3 text-sm shadow-sm transition-colors focus:ring-1 focus:outline-none"
          aria-label={ariaLabel || label}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterSelect;
