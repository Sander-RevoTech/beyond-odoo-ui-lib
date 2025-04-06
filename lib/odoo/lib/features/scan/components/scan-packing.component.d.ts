import { MatDialog } from '@angular/material/dialog';
import { Scope } from './scan-packing-modal/scan-packing-modal.component';
import { BydBaseComponent } from '@beyond/utils';
import * as i0 from "@angular/core";
export declare class BydScanPackingComponent extends BydBaseComponent {
    private _dialog;
    scopes: Scope[];
    private readonly _scanPacking;
    constructor(_dialog: MatDialog);
    openScan: () => void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydScanPackingComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BydScanPackingComponent, "byd-scan-packing", never, { "scopes": { "alias": "scopes"; "required": false; }; }, {}, never, never, true, never>;
}
