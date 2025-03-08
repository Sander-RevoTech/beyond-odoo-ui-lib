export interface BaseStrapi {
    documentId?: string;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
}
export declare const baseStrapiProps: (keyof BaseStrapi)[];
