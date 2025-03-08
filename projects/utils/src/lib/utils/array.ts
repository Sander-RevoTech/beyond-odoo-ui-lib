export const getUniqueValues = <T>(inputArray: T[], propName: (x: T) => any): T[] => {
  return [...new Map(inputArray.map(x => [propName(x), x])).values()];
};

export const getUniqueArray = <T>(array: T[]): T[] => {
  return [...new Set(array)].filter(isNonNullable);
};

export const isNonNullable = <T>(value: T): value is NonNullable<T> => {
  return value !== null && value !== undefined;
};

export const toArray = <T>(value: T | T[]) => {
  return Array.isArray(value) ? value : [value];
};

export const keepUniqueObjectByProperty = <T>(list: T[], property: (item: T) => any): T[] => {
  const unique = getUniqueArray(list.map(property));
  return unique.map(u => list.find(item => property(item) === u)).filter(isNonNullable);
};

/**
 * @deprecated
 */
export const removeElementsWithSameProperty = <T>(arrayA: T[], arrayB: T[], property: (item: any) => any): T[] => {
  const idsToDelete = arrayB.map(property);
  return arrayA.filter(item => !idsToDelete.includes(property(item)));
};

/**
 * @deprecated
 */
export const removeElement = <T>(array: T[], elementToRemove: T): T[] => {
  let indexOfElement = array.indexOf(elementToRemove);

  if (indexOfElement > -1) array.splice(indexOfElement, 1);

  return array;
};
