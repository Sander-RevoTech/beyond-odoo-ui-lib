import { PageInfo } from './pageInfo';
export interface ReponseQueryData<T> {
    pageInfo?: PageInfo;
    totalCount: number;
    items?: T[];
}
export interface ReponseMutationData<T> {
    [key: string]: T;
}
