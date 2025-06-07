import { OnInit } from '@angular/core';
import { BydBaseComponent } from '@beyond/utils';
import { Observable } from 'rxjs';
import { BydGridData } from '../models/grid-data';
import * as i0 from "@angular/core";
export declare abstract class BydAbstractGridComponent<T> extends BydBaseComponent implements OnInit {
    gridId: string;
    get grid(): BydGridData<T>;
    get isGroup(): boolean;
    get data(): T[];
    get dataByGroup(): {
        key: string;
        data: T[];
    }[];
    get displayType(): import("@angular/core").WritableSignal<import("@beyond/features").ViewType>;
    isReady$: Observable<boolean>;
    isDataReady$: Observable<boolean>;
    protected _grid: BydGridData<T>;
    private _dataService;
    constructor();
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydAbstractGridComponent<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BydAbstractGridComponent<any>, "ng-component", never, { "gridId": { "alias": "gridId"; "required": false; }; }, {}, never, never, true, never>;
}
