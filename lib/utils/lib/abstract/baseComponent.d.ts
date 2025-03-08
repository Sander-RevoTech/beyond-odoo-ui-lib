import { OnDestroy } from '@angular/core';
import { BydAbstractComponent } from './abstractComponent';
import * as i0 from "@angular/core";
export declare abstract class BydBaseComponent extends BydAbstractComponent implements OnDestroy {
    constructor();
    trackById(_: any, item: {
        id: number | string;
    }): string | number;
    trackByKey(_: any, item: {
        key: string;
    }): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydBaseComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BydBaseComponent, "ng-component", never, {}, {}, never, never, true, never>;
}
