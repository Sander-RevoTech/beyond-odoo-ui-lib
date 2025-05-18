import { Filter as TabulatorFilter } from 'tabulator-tables';

type KeyValuePair = {
  key: string;
  value: number;
};

export enum ParameterType {
  Unknown,
  String,
  Number,
  Boolean,
  DateTime,
  Enum,
}

export interface ColMetaData {
  name: string;
  type: ParameterType;
  // enumName?: 'Criticity' | string;
  // nullable: boolean;
  // multiSearchEnabled: boolean;
  // meSearchEnabled: boolean;
  // showEntireListWhenFiltering: boolean;
  // additionalInfo: KeyValuePair[];
}

export type ActiveFilter = { key: string; values: Filter[] };
export type Filter = TabulatorFilter;
export type Sort = { field: string; dir: 'asc' | 'desc' };

export type ajaxResponse<T> = { data: T[]; last_page: number };
export type ajaxRequestFuncParams = { filter: Filter[]; sort: Sort[]; page: number; size: number };

export type ViewType = 'grid' | 'card';
