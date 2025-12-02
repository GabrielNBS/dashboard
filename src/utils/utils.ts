import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getGreetingByHour } from './helpers/dateTime';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getHowHours = () => {
  return getGreetingByHour();
};
