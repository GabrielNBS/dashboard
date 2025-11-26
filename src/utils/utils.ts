import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getHowHours = () => {
  const date = new Date();
  const hours = date.getHours();

  if (hours >= 6 && hours < 12) {
    return 'Bom dia';
  } else if (hours >= 12 && hours < 18) {
    return 'Boa tarde';
  } else {
    return 'Boa noite';
  }
};
