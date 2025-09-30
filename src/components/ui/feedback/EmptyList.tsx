import React from 'react';
import { Button } from '../base';

type EmptyListProps = {
  title: string;
  message: string;
  icon?: React.ReactNode;
  actionButton?: React.ReactNode;
  actionMessage?: string;
};

export function EmptyList({ title, message, icon, actionButton, actionMessage }: EmptyListProps) {
  return (
    <div className="text-muted-muted mt-4 flex w-3xl flex-col items-center justify-center rounded-lg p-8 text-center">
      {icon && <div className="text-muted-foreground mb-4">{icon}</div>}
      <h3 className="mb-4 text-lg font-medium">{title}</h3>
      <p className="text-muted-foreground text-sm">{message}</p>
      {actionButton && <Button>{actionMessage}</Button>}
    </div>
  );
}

export default EmptyList;
