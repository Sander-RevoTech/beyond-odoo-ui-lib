import { getUniqueArray } from '@beyond/utils';

export const groupBy = <T>(key: keyof T | null, data: T[]): { key: string; data: T[] }[] => {
  if (!key) {
    return [{ key: '', data }];
  }

  const keys = getUniqueArray<any>(data.map(item => item[key]));

  return keys.map(k => ({
    key: k.toString(),
    data: data.filter(item => item[key] === k),
  }));
};
