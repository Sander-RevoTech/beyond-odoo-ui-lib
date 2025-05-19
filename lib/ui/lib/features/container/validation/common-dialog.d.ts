import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { BydDialogValidationReturn } from './dialog/dialog-validation.component';
export type TranslationData = {
    title?: string;
    content?: string;
    ctaNo?: string;
    ctaYes?: string;
};
export declare const openDialog: (dialog: MatDialog, data?: TranslationData) => Observable<BydDialogValidationReturn | undefined>;
