import { ElementRef } from '@angular/core';
import { BydAbstractGridComponent } from '../abstract.component';
import { ColMetaData } from '../../models/types';
import * as i0 from "@angular/core";
export declare class BydGridContainerComponent extends BydAbstractGridComponent<unknown> {
    model: string;
    colsMetaData: ColMetaData[];
    tableElement: ElementRef;
    private _service;
    ngAfterViewInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydGridContainerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BydGridContainerComponent, "byd-grid-container", never, { "model": { "alias": "model"; "required": false; }; "colsMetaData": { "alias": "colsMetaData"; "required": false; }; }, {}, never, ["*"], true, never>;
}
