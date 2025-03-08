export declare const getUniqueValues: <T>(inputArray: T[], propName: (x: T) => any) => T[];
export declare const getUniqueArray: <T>(array: T[]) => T[];
export declare const isNonNullable: <T>(value: T) => value is NonNullable<T>;
export declare const toArray: <T>(value: T | T[]) => T[];
export declare const keepUniqueObjectByProperty: <T>(list: T[], property: (item: T) => any) => T[];
/**
 * @deprecated
 */
export declare const removeElementsWithSameProperty: <T>(arrayA: T[], arrayB: T[], property: (item: any) => any) => T[];
/**
 * @deprecated
 */
export declare const removeElement: <T>(array: T[], elementToRemove: T) => T[];
