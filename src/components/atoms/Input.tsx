import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-subtitle font-medium">{label}</label>}
      <input
        className={`focus:border-primary focus:ring-primary text-paragraph placeholder:text-hero-gray-400 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      />
      {error && <span className="text-paragraph text-red-500">{error}</span>}
    </div>
  );
}
