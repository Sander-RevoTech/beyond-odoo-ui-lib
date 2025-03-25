import { MatDialog } from '@angular/material/dialog';

import { Observable, filter } from 'rxjs';

import { BydDialogValidationComponent, BydDialogValidationReturn } from './dialog/dialog-validation.component';

export type TranslationData = { title?: string; content?: string; ctaNo?: string; ctaYes?: string };

export const openDialog = (
  dialog: MatDialog,
  data?: TranslationData
): Observable<BydDialogValidationReturn | undefined> => {
  return dialog
    .open<BydDialogValidationComponent, TranslationData, BydDialogValidationReturn>(BydDialogValidationComponent, {
      width: '100%',
      data,
    })
    .afterClosed()
    .pipe(filter(data => data?.accepted ?? false));
};
