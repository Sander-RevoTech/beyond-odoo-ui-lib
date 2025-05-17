import { ElementRef } from "@angular/core";
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import { ajaxRequestFuncParams, ajaxResponse, ColMetaData, ViewType } from "./types";
import { BaseCol } from "./cols/base-col";
import { BehaviorSubject, Observable } from "rxjs";
import { BydGridFilters } from "./grid-filters";
export interface IDataService<T> {
    getData$: (params: ajaxRequestFuncParams) => Observable<ajaxResponse<T>>;
}
export declare class BydGridData<T> {
    readonly scope: string;
    get data(): T[];
    table: Tabulator | null;
    cols: {
        [index: string]: BaseCol<any>;
    };
    filters: BydGridFilters | null;
    readonly isReady$: BehaviorSubject<boolean>;
    tableHtml: ElementRef | null;
    readonly displayType: import("@angular/core").WritableSignal<ViewType>;
    constructor(scope: string);
    init(params: {
        elementRef: ElementRef;
        colsMetaData: ColMetaData[];
        services: IDataService<T>;
    }): void;
    switchView(type: ViewType): void;
    private _getColumns;
    private _factoryCols;
}
