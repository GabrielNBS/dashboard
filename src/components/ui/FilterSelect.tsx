// components/ui/FilterSelect.tsx
import React from 'react';

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

const FilterSelect: React.FC<FilterSelectProps> = ({ value, onChange, options }) => {
  return (
    <div className="relative">
      <select
        title={value}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="border-input bg-background focus:border-primary focus:ring-ring block w-full appearance-none rounded-md border py-2 pr-10 pl-3 text-sm shadow-sm transition-colors focus:ring-1 focus:outline-none"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <svg
          className="h-4 w-4 opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
  );
};

export default FilterSelect;
