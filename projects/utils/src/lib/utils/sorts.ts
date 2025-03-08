import { compare } from './compare';

type Option = {
  active: string;
  direction: 'asc';
};

export const sort = (array: any[], options: Option): any[] => {
  if (!options) {
    return array;
  }
  return array.sort((a, b) => {
    return compare(a[options.active], b[options.active], options.direction === 'asc');
  });
};
