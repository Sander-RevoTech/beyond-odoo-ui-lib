import { OnInit } from '@angular/core';
import { BydBaseComponent } from '@beyond/utils';
import { BydGridData } from '../models/grid-data';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare abstract class BydAbstractGridComponent<T> extends BydBaseComponent implements OnInit {
    gridId: string;
    get data(): T[];
    get displayType(): import("@angular/core").WritableSignal<import("@beyond/features").ViewType>;
    isReady$: Observable<boolean>;
    protected _grid: BydGridData<T>;
    private _dataService;
    constructor();
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydAbstractGridComponent<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BydAbstractGridComponent<any>, "ng-component", never, { "gridId": { "alias": "gridId"; "required": false; }; }, {}, never, never, true, never>;
}
