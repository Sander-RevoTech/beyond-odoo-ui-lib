import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { TranslatePipe } from '@beyond/translation';
import { BydButtonComponent, BydTitleComponent } from '@beyond/ui';
import { BydBaseComponent } from '@beyond/utils';

import { ENotificationCode } from '../../../enum';
import { BydNotificationService } from '../../../services/notification.service';

export interface ErrorParams {
  message: string;
}
@Component({
  selector: '',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
  standalone: true,
  imports: [BydTitleComponent, BydButtonComponent, TranslatePipe],
})
export class ErrorDialog extends BydBaseComponent {
  private readonly _notificationService = inject(BydNotificationService);

  constructor(
    public dialogRef: MatDialogRef<ErrorDialog>,
    @Inject(MAT_DIALOG_DATA) public data?: ErrorParams
  ) {
    super();
  }

  public close() {
    this.dialogRef.close();
  }

  public copyContent = async () => {
    try {
      await navigator.clipboard.writeText(this.data?.message ?? '');
      this._notificationService.addNotification('Content copied to clipboard', ENotificationCode.success);
    } catch (err) {
      this._notificationService.addNotification('Failed to copy', ENotificationCode.error);
    }
  };
}
