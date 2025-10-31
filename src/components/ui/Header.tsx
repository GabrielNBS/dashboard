import React, { ReactElement } from 'react';

type HeaderProps = {
  title: string | ReactElement;
  subtitle: string;
  className?: string;
};

export function Header({ title, subtitle, className }: HeaderProps) {
  return (
    <div className={className}>
      <h1 className="text-primary text-xl font-bold">{title}</h1>
      <p className="text-muted-foreground text-lg">{subtitle}</p>
    </div>
  );
}
