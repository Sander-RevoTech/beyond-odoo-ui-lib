import { MatDialogRef } from '@angular/material/dialog';
import { BydBaseComponent } from '@beyond/utils';
import * as i0 from "@angular/core";
export interface ErrorParams {
    message: string;
}
export declare class ErrorDialog extends BydBaseComponent {
    dialogRef: MatDialogRef<ErrorDialog>;
    data?: ErrorParams | undefined;
    private readonly _notificationService;
    constructor(dialogRef: MatDialogRef<ErrorDialog>, data?: ErrorParams | undefined);
    close(): void;
    copyContent: () => Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ErrorDialog, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ErrorDialog, "ng-component", never, {}, {}, never, never, true, never>;
}
