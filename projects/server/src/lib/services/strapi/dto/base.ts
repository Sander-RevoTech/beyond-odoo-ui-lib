export interface BaseStrapi {
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export const baseStrapiProps: (keyof BaseStrapi)[] = ['documentId', 'createdAt', 'updatedAt', 'publishedAt'];
