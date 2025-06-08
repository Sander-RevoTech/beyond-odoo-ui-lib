import { EventEmitter } from '@angular/core';
import { BydBaseComponent } from '@beyond/utils';
import * as i0 from "@angular/core";
export declare class BydScanningComponent extends BydBaseComponent {
    scanSuccess: EventEmitter<string>;
    error: EventEmitter<any>;
    private readonly _notificationService;
    permissionResponse(repsonse: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydScanningComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BydScanningComponent, "byd-scanning", never, {}, { "scanSuccess": "scanSuccess"; "error": "error"; }, never, never, true, never>;
}
