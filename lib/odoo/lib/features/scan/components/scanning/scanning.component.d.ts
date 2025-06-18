import { EventEmitter } from '@angular/core';
import { BydBaseComponent } from '@beyond/utils';
import * as i0 from "@angular/core";
export declare class BydScanningComponent extends BydBaseComponent {
    scanSuccess: EventEmitter<string>;
    error: EventEmitter<any>;
    close: EventEmitter<any>;
    private readonly _notificationService;
    scanError(error: {
        message?: unknown;
        cause?: unknown;
    } | undefined): void;
    permissionResponse(repsonse: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydScanningComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BydScanningComponent, "byd-scanning", never, {}, { "scanSuccess": "scanSuccess"; "error": "error"; "close": "close"; }, never, never, true, never>;
}
