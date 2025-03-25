import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { TranslationData } from '../common-dialog';
import { BydButtonComponent } from '../../../../components/button/button.component';

export interface BydDialogValidationReturn {
  accepted: boolean;
}
@Component({
  selector: 'byd-dialog-validation',
  templateUrl: './dialog-validation.component.html',
  styleUrls: ['./dialog-validation.component.scss'],
  standalone: true,
  imports: [BydButtonComponent]
})
export class BydDialogValidationComponent {
  constructor(
    public dialogRef: MatDialogRef<BydDialogValidationComponent, BydDialogValidationReturn>,
    @Inject(MAT_DIALOG_DATA) public data?: TranslationData
  ) {}

  onNoClick(): void {
    this.dialogRef.close({ accepted: false });
  }
  onYesClick(): void {
    this.dialogRef.close({ accepted: true });
  }
}
