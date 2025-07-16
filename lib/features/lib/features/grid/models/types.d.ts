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
export interface ColMetaData<T = unknown> {
    name: keyof T;
    type: ParameterType;
    isSearchField?: boolean;
    notDisplayable?: boolean;
    multivalues?: boolean;
    enumValues?: string[];
    dataSearch$?: (search?: string) => Observable<InputChoicesOption[]>;
    manyToOneOptions?: {
        field: string;
        model: string;
        data$: (id: number[]) => Observable<string[]>;
    };
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
    total: number;
};
export type ajaxRequestFuncParams = {
    filter: Filter[];
    sort: Sort[];
    groupBy: string | null;
    page: number;
    size: number;
    colsMetaData: ColMetaData[];
};
export type ViewType = 'grid' | 'card';
export type Preset = {
    name: string;
    filters: Filter[];
};
