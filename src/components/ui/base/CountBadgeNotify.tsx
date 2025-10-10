import React from 'react';

interface CountBadgeProps {
  count: number;
  isActive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const CountBadgeNotify = ({
  count,
  isActive = false,
  size = 'md',
  className = '',
}: CountBadgeProps) => {
  const sizeClasses = {
    sm: 'h-3 w-3 text-[10px]',
    md: 'h-4 w-4 text-xs',
    lg: 'h-5 w-5 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-black ${
        sizeClasses[size]
      } ${
        isActive ? 'bg-accent text-accent-foreground' : 'bg-border text-muted-foreground'
      } ${className}`}
    >
      {count}
    </span>
  );
};

export default CountBadgeNotify;
