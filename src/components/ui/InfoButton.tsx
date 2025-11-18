'use client';

import React, { useState } from 'react';

interface InfoButtonProps {
  info: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
}

export const InfoButton: React.FC<InfoButtonProps> = ({ info, position = 'top', size = 'md' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const sizeClasses = {
    sm: 'h-4 w-4 text-xs',
    md: 'h-5 w-5 text-sm',
    lg: 'h-6 w-6 text-base',
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-popover',
    bottom:
      'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-popover',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-popover',
    right:
      'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-popover',
  };

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className={`${sizeClasses[size]} bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:ring-ring inline-flex items-center justify-center rounded-full transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none`}
        aria-label="Informação"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-full w-full p-0.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
          />
        </svg>
      </button>

      {isVisible && (
        <div
          className={`absolute z-50 ${positionClasses[position]} animate-in fade-in-0 zoom-in-95 w-64`}
          role="tooltip"
        >
          <div className="border-border bg-popover text-popover-foreground rounded-md border px-3 py-2 text-sm shadow-md">
            {info}
          </div>
          <div className={`absolute h-0 w-0 border-4 ${arrowClasses[position]}`} />
        </div>
      )}
    </div>
  );
};
