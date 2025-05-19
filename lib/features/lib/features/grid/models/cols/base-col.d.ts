import { InputBase } from '@beyond/form-model';
import { Observable } from 'rxjs';
import { ColumnDefinition } from 'tabulator-tables';
import { BydGridData } from '../grid-data';
import { ColMetaData, Filter } from '../types';
export declare const operatorMap: {
    [key: string]: string;
};
export interface IFilterOptions {
    allow: boolean;
}
export interface IColOptions {
    sortable?: boolean;
    filters?: IFilterOptions;
    enumInfo?: {
        cellRenderer: any;
        enum: any | null;
        values: {
            id: string;
            name: string;
        }[];
    };
    dataSearch$?: (search: string, colId: string) => Observable<string[]>;
}
export interface IBaseCol {
    scope: string;
    col: ColMetaData;
    options?: IColOptions;
}
export declare class BaseCol<T> {
    data: IBaseCol;
    model: BydGridData<any>;
    get key(): string;
    get options(): IColOptions | undefined;
    get inputLabel(): string;
    constructor(data: IBaseCol, model: BydGridData<any>);
    getColDef(): ColumnDefinition;
    getInputForm(): InputBase<any> | null;
    formatInputForm(data: any): Filter | null;
}
