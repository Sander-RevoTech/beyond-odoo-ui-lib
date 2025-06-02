import { InputChoicesOption } from '@beyond/form-model';
import { Observable } from 'rxjs';
import { Filter as TabulatorFilter } from 'tabulator-tables';

export enum ParameterType {
  Unknown,
  String,
  Number,
  Boolean,
  DateTime,
  Enum,
  Relation,
}

export interface ColMetaData {
  name: string;
  type: ParameterType;
  multivalues?: boolean;
  enumValues?: string[];
  dataSearch$?: (search?: string) => Observable<InputChoicesOption[]>;
  manyToOneOptions?: {
    field: string;
    model: string;
    data$: (id: number[]) => Observable<string[]>;
  };
}

export type ActiveFilter = { key: string; values: Filter[] };
export type Filter = TabulatorFilter;
export type Sort = { field: string; dir: 'asc' | 'desc' };

export type ajaxResponse<T> = { data: T[]; last_page: number };
export type ajaxRequestFuncParams = {
  filter: Filter[];
  sort: Sort[];
  groupBy: string | null;
  page: number;
  size: number;
  colsMetaData: ColMetaData[];
};

export type ViewType = 'grid' | 'card';
