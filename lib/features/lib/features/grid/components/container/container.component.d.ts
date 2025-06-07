import { AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { ColMetaData } from '../../models/types';
import { BydAbstractGridComponent } from '../abstract.component';
import * as i0 from "@angular/core";
export declare class BydGridContainerComponent extends BydAbstractGridComponent<unknown> implements AfterViewInit, OnDestroy {
    model: string;
    colsMetaData: ColMetaData[];
    tableElement: ElementRef;
    private _session;
    private _service;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydGridContainerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BydGridContainerComponent, "byd-grid-container", never, { "model": { "alias": "model"; "required": false; }; "colsMetaData": { "alias": "colsMetaData"; "required": false; }; }, {}, never, ["*"], true, never>;
}
