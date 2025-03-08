/**
 * Performs a deep merge of objects and returns new object. Does not modify
 * objects (immutable) and merges arrays via concatenation.
 * @param init object - Initial Object
 * @param {...object} objects - Objects to merge
 * @returns {object} New object with merged key/values
 */
export declare const merge: (override?: boolean) => <T>(init: T, ...objects: Array<any>) => T;
export declare const getPropertyTypes: <T extends object>(obj: T) => { [K in keyof T]: string; };
export declare const ObjectKeys: <T>(object: T) => (keyof T)[];
export declare const ObjectKeysReOrder: <T>(base: T, keysOrder: Array<keyof T>) => T;
