import { InputChoicesOption } from '@beyond/form-model';
import { Observable } from 'rxjs';
import { Filter as TabulatorFilter } from 'tabulator-tables';
export declare enum ParameterType {
    Unknown = 0,
    String = 1,
    Number = 2,
    Boolean = 3,
    DateTime = 4,
    Enum = 5,
    Relation = 6
}
export interface ColMetaData {
    name: string;
    type: ParameterType;
    multivalues?: boolean;
    enumValues?: string[];
    dataSearch$?: (search?: string) => Observable<InputChoicesOption[]>;
}
export type ActiveFilter = {
    key: string;
    values: Filter[];
};
export type Filter = TabulatorFilter;
export type Sort = {
    field: string;
    dir: 'asc' | 'desc';
};
export type ajaxResponse<T> = {
    data: T[];
    last_page: number;
};
export type ajaxRequestFuncParams = {
    filter: Filter[];
    sort: Sort[];
    groupBy: string | null;
    page: number;
    size: number;
};
export type ViewType = 'grid' | 'card';
