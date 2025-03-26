import { Component, inject } from '@angular/core';

import { tap } from 'rxjs/operators';

import { BydBaseComponent } from '@beyond/utils';

import { ENotificationCode } from '../../../enum';
import { BydNotificationService } from '../../../services/notification.service';
import { NotificationInlineComponent } from "../inline/notification-inline.component";
import { NgFor } from '@angular/common';
import { EToast, ToastComponent } from '@beyond/ui';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialog, ErrorParams } from '../error/error.component';

@Component({
  selector: 'byd-notification-box',
  templateUrl: './notification-box.component.html',
  styleUrls: ['./notification-box.component.scss'],
  standalone: true,
  imports: [NotificationInlineComponent, NgFor, ToastComponent],
})
export class NotificationBoxComponent extends BydBaseComponent {
  private readonly _notificationService = inject(BydNotificationService);

  public list: { message: string; code: ENotificationCode }[] = [];

  constructor(private _dialog: MatDialog) {
    super();

    this._registerSubscription(
      this._notificationService.newNotification$
        .pipe(
          tap(notification => {
            this.list.push(notification);
          }),
          tap(notification => {
            setTimeout(() => {
              this.list = this.list.filter(item => item !== notification);
            }, 3000);
          })
        )
        .subscribe()
    );

    this._registerSubscription(
      this._notificationService.errorNotification$
        .pipe(
          tap(notification => {
            this._dialog.open<ErrorDialog, ErrorParams>(ErrorDialog, { data: { message: notification.message } });
          })
        )
        .subscribe()
    );
  }

  public getCode(code: ENotificationCode): EToast {
    return code as unknown as EToast;
  }
}
