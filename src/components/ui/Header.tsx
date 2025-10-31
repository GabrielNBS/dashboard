import React, { ReactElement } from 'react';

type HeaderProps = {
  title: string | ReactElement;
  subtitle: string;
};

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <div>
      <h1 className="text-primary text-xl font-bold">{title}</h1>
      <p className="text-muted-foreground text-lg">{subtitle}</p>
    </div>
  );
}
