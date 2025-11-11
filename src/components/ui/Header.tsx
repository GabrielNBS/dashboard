import React, { ReactElement } from 'react';

type HeaderProps = {
  title: string | ReactElement;
  subtitle: string;
  className?: string;
};

export function Header({ title, subtitle, className }: HeaderProps) {
  return (
    <div className={className}>
      <h1 className="text-primary text-lg font-bold sm:text-xl md:text-2xl">{title}</h1>
      <p className="text-muted-foreground text-sm sm:text-base md:text-lg">{subtitle}</p>
    </div>
  );
}
