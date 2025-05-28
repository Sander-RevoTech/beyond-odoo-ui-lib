import { ElementRef } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import { BaseCol } from './cols/base-col';
import { BydGridFilters } from './grid-filters';
import { ColMetaData, ViewType, ajaxRequestFuncParams, ajaxResponse } from './types';
export interface IDataService<T> {
    getData$: (params: ajaxRequestFuncParams) => Observable<ajaxResponse<T>>;
}
export declare class BydGridData<T> {
    readonly scope: string;
    get data(): T[];
    get dataByGroup(): {
        key: string;
        data: T[];
    }[];
    get isGroup(): boolean;
    readonly rowClicked$: Subject<T>;
    table: Tabulator | null;
    cols: {
        [index: string]: BaseCol<any>;
    };
    filters: BydGridFilters | null;
    readonly isReady$: BehaviorSubject<boolean>;
    tableHtml: ElementRef | null;
    readonly displayType: import("@angular/core").WritableSignal<ViewType>;
    groupBy: keyof T | null;
    constructor(scope: string);
    init(params: {
        elementRef: ElementRef;
        colsMetaData: ColMetaData[];
        services: IDataService<T>;
    }): void;
    destroy(): void;
    setGroupBy(field: string): void;
    clearGroupBy(): void;
    switchView(type: ViewType): void;
    private _getColumns;
    private _factoryCols;
}
