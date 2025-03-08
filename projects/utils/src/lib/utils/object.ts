import { RecursivePartial } from '../types/type';
import { isNonNullable } from './array';

/**
 * Performs a deep merge of objects and returns new object. Does not modify
 * objects (immutable) and merges arrays via concatenation.
 * @param init object - Initial Object
 * @param {...object} objects - Objects to merge
 * @returns {object} New object with merged key/values
 */
export const merge =
  (override = true) =>
  <T>(init: T, ...objects: Array<any>) => {
    // RecursivePartial<T>
    const isObject = (obj: any) => obj && typeof obj === 'object';

    return objects.reduce<T>((prev, obj) => {
      (<Array<keyof T>>Object.keys(obj)).forEach(key => {
        const pVal = prev[key] as any;
        const oVal = obj[key] as any;

        if (Array.isArray(pVal) && Array.isArray(oVal)) {
          prev[key] = <any>pVal.concat(...oVal);
        } else if (isObject(pVal) && isObject(oVal)) {
          prev[key] = <any>merge(override)(pVal, oVal);
        } else {
          if (!pVal || (pVal && override)) {
            prev[key] = oVal;
          }
        }
      });

      return prev;
    }, init);
  };

export const getPropertyTypes = <T extends object>(obj: T): { [K in keyof T]: string } => {
  const propertyTypes: { [K in keyof T]: string } = {} as { [K in keyof T]: string };

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      propertyTypes[key as keyof T] = typeof obj[key];
    }
  }

  return propertyTypes;
};

export const ObjectKeys = <T>(object: T) => (object instanceof Object ? <Array<keyof T>>Object.keys(object) : []);

export const ObjectKeysReOrder = <T>(base: T, keysOrder: Array<keyof T>): T => {
  return keysOrder.reduce<T>((final, key) => {
    if ((<any>base).hasOwnProperty(key)) {
      final[key] = base[key];
    }
    return final;
  }, {} as any);
};
