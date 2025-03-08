import { ObjectKeys } from '@beyond/utils';

export const graphQlUpdateFields = (object: any): { updatedFields: string[] } => {
  return { updatedFields: <string[]>ObjectKeys(object) };
};
