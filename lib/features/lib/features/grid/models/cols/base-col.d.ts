import { InputBase } from '@beyond/form-model';
import { ColumnDefinition } from 'tabulator-tables';
import { BydGridData } from '../grid-data';
import { ColMetaData, Filter } from '../types';
export declare const operatorMap: {
    [key: string]: string;
};
export interface IFilterOptions {
    allow: boolean;
}
export interface IBaseCol {
    scope: string;
    col: ColMetaData;
}
export declare class BaseCol<T> {
    data: IBaseCol;
    model: BydGridData<any>;
    get key(): never;
    get inputLabel(): string;
    get filterValues(): T[];
    constructor(data: IBaseCol, model: BydGridData<any>);
    getColDef(): ColumnDefinition;
    getInputForm(): InputBase<any> | null;
    formatInputForm(data: any): Filter | null;
}
