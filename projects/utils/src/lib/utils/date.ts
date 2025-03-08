import { differenceInMinutes } from 'date-fns';

export const toLocalDateString = (utcDateString: string): string => {
  return toLocalDate(utcDateString).toString();
};

export const toLocalDate = (utcDateString: string): Date => {
  const utcDate = new Date(utcDateString);
  return new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60 * 1000);
};

export const toUtcDate = (localDateString: Date): Date => {
  return new Date(localDateString.getTime() - localDateString.getTimezoneOffset() * 60 * 1000);
};

export const diffInHourAndMinutes = (start: string, end: string): { h: string; m: string } => {
  const diff = differenceInMinutes(new Date(end), new Date(start));

  const hours = Math.floor(diff / 60);
  const minutes = Math.round(diff - hours * 60);

  return { h: hours.toString().padStart(2, '0'), m: minutes.toString().padStart(2, '0') };
};
