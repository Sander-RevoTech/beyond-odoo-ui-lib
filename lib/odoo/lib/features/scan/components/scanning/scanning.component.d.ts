import { EventEmitter } from '@angular/core';
import { BydBaseComponent } from '@beyond/utils';
import * as i0 from "@angular/core";
export declare class ScanningComponent extends BydBaseComponent {
    scanSuccess: EventEmitter<string>;
    error: EventEmitter<any>;
    private readonly _notificationService;
    permissionResponse(repsonse: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ScanningComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ScanningComponent, "byd-scanning", never, {}, { "scanSuccess": "scanSuccess"; "error": "error"; }, never, never, true, never>;
}
