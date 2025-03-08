import { PageInfo } from './pageInfo';

export interface GraphReponsePagedData<T> {
  [key: string]: {
    pageInfo?: PageInfo;
    totalCount: number;
    items?: T[];
  };
}
