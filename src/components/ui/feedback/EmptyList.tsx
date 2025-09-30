import React from 'react';

type EmptyListProps = {
  title: string;
  message: string;
  icon?: React.ReactNode;
};

export function EmptyList({ title, message, icon }: EmptyListProps) {
  return (
    <div className="bg-surface text-muted-muted mt-4 flex flex-col items-center justify-center rounded-lg p-8 text-center shadow-md">
      {icon && <div className="mb-4">{icon}</div>}
      <h3 className="text-muted/90 text-lg font-semibold">{title}</h3>
      <p className="text-sm">{message}</p>
    </div>
  );
}

export default EmptyList;
