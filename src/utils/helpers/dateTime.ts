import {
  addDays as addDaysFn,
  addMonths as addMonthsFn,
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfDay as endOfDayFn,
  endOfMonth as endOfMonthFn,
  format,
  fromUnixTime,
  getDaysInMonth as getDaysInMonthFn,
  getHours,
  getUnixTime,
  isSameMonth,
  isToday as isTodayFn,
  isValid,
  startOfDay as startOfDayFn,
  startOfMonth as startOfMonthFn,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

const parseDateInput = (date: Date | string): Date => {
  const parsed = typeof date === 'string' ? new Date(date) : date;

  if (!isValid(parsed)) {
    throw new Error('Data inválida');
  }

  return parsed;
};

const capitalize = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

export function getGreetingByHour(): string {
  const hour = getHours(new Date());

  if (hour >= 5 && hour < 12) {
    return 'Bom dia';
  }

  if (hour >= 12 && hour < 18) {
    return 'Boa tarde';
  }

  return 'Boa noite';
}

export function formatDateBR(date: Date | string): string {
  const parsed = parseDateInput(date);
  return format(parsed, 'dd/MM/yyyy', { locale: ptBR });
}

export function formatDateTimeBR(date: Date | string): string {
  const parsed = parseDateInput(date);
  return format(parsed, 'dd/MM/yyyy HH:mm', { locale: ptBR });
}

export function formatDateISO(date: Date | string): string {
  const parsed = parseDateInput(date);
  return format(parsed, 'yyyy-MM-dd');
}

export function getDaysInMonth(year: number, month: number): number {
  return getDaysInMonthFn(new Date(year, month, 1));
}

export function getDaysInCurrentMonth(): number {
  return getDaysInMonthFn(new Date());
}

export function getDaysBetween(startDate: Date | string, endDate: Date | string): number {
  const start = parseDateInput(startDate);
  const end = parseDateInput(endDate);
  const diffDays = Math.abs(differenceInCalendarDays(end, start));

  return diffDays + 1; // +1 para incluir ambos os dias
}

export function isCurrentMonth(date: Date | string): boolean {
  return isSameMonth(parseDateInput(date), new Date());
}

export function isToday(date: Date | string): boolean {
  return isTodayFn(parseDateInput(date));
}

export function startOfDay(date: Date | string): Date {
  return startOfDayFn(parseDateInput(date));
}

export function endOfDay(date: Date | string): Date {
  return endOfDayFn(parseDateInput(date));
}

export function startOfMonth(date: Date | string = new Date()): Date {
  return startOfMonthFn(parseDateInput(date));
}

export function endOfMonth(date: Date | string = new Date()): Date {
  return endOfMonthFn(parseDateInput(date));
}

export function addDays(date: Date | string, days: number): Date {
  return addDaysFn(parseDateInput(date), days);
}

export function addMonths(date: Date | string, months: number): Date {
  return addMonthsFn(parseDateInput(date), months);
}

export function getDateRange(startDate: Date | string, endDate: Date | string): string[] {
  const start = parseDateInput(startDate);
  const end = parseDateInput(endDate);

  if (start > end) {
    return [];
  }

  return eachDayOfInterval({ start, end }).map(current => formatDateISO(current));
}

export function getMonthName(monthIndex: number, short: boolean = false): string {
  if (monthIndex < 0 || monthIndex > 11) {
    throw new Error('Índice de mês inválido (deve ser 0-11)');
  }

  const monthDate = new Date(2000, monthIndex, 1);
  const token = short ? 'LLL' : 'LLLL';
  const label = format(monthDate, token, { locale: ptBR });

  return capitalize(label);
}

export function getDayName(dayIndex: number, short: boolean = false): string {
  if (dayIndex < 0 || dayIndex > 6) {
    throw new Error('Índice de dia inválido (deve ser 0-6)');
  }

  // 2000-01-02 é um domingo; somamos dayIndex para manter o alinhamento
  const referenceDate = new Date(2000, 0, dayIndex + 2);
  const token = short ? 'EEE' : 'EEEE';
  const label = format(referenceDate, token, { locale: ptBR });

  return capitalize(label);
}

export function formatRelativeDate(date: Date | string): string {
  const parsed = startOfDayFn(parseDateInput(date));
  const today = startOfDayFn(new Date());
  const diffDays = differenceInCalendarDays(today, parsed);

  if (isTodayFn(parsed)) {
    return 'Hoje';
  }

  if (diffDays === 1) {
    return 'Ontem';
  }

  if (diffDays === -1) {
    return 'Amanhã';
  }

  if (diffDays > 1 && diffDays < 7) {
    return `Há ${diffDays} dias`;
  }

  if (diffDays < -1 && diffDays > -7) {
    return `Em ${Math.abs(diffDays)} dias`;
  }

  return formatDateBR(parsed);
}

export function fromUnixTimestamp(timestamp: number): Date {
  return fromUnixTime(timestamp);
}

export function toUnixTimestamp(date: Date | string): number {
  return getUnixTime(parseDateInput(date));
}
