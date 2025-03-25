import { MatDialogRef } from '@angular/material/dialog';
import { TranslationData } from '../common-dialog';
import * as i0 from "@angular/core";
export interface BydDialogValidationReturn {
    accepted: boolean;
}
export declare class BydDialogValidationComponent {
    dialogRef: MatDialogRef<BydDialogValidationComponent, BydDialogValidationReturn>;
    data?: TranslationData | undefined;
    constructor(dialogRef: MatDialogRef<BydDialogValidationComponent, BydDialogValidationReturn>, data?: TranslationData | undefined);
    onNoClick(): void;
    onYesClick(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydDialogValidationComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BydDialogValidationComponent, "byd-dialog-validation", never, {}, {}, never, never, true, never>;
}
