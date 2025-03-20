import { Component, inject, signal } from '@angular/core';

import { BydAuthOdooService, BydBaseOdooService } from '@beyond/odoo';
import { LoaderComponent } from '@beyond/ui';
import { BydBaseComponent } from '@beyond/utils';
import { BydFormComponent } from '@beyond/form-basic';
import { ENotificationCode, BydNotificationService } from '@beyond/notification';
import { AppUserFormService } from '../../services/form/form.service';

@Component({
  selector: 'byd-login-card',
  templateUrl: './login-card.component.html',
  styleUrls: ['./login-card.component.scss'],
  imports: [LoaderComponent, BydFormComponent],
  standalone: true
})
export class LoginCardComponent extends BydBaseComponent {
  private readonly _authService = inject(BydAuthOdooService);
  private readonly _notificationService = inject(BydNotificationService);
  private readonly _formService = inject(AppUserFormService);
  private readonly _odooService = inject(BydBaseOdooService);

  public readonly form = signal(this._formService.getLoginForm())
  constructor() {
    super();
  }

  public login(data: any) {
    this.requestState.asked();
    const loginData = this._formService.formatLoginForm(data);

    this._authService.login$({identifier: loginData.user, password: loginData.pass}).subscribe({
      next: uid => {
        this.requestState.completed();

        if (uid) {
          this._successMessage();
        } else {
          this._errorMessage('notification.success');
        }
        this._odooService._odooService.searchRead$('res.partner', [])
      },
      error: (message: string) => {
        this.requestState.completed();
        this._errorMessage(message);
      },
    });
  }

  private _successMessage() {
    this._notificationService.addNotification('notification.success', ENotificationCode.success);
    this._router.navigateByUrl('/');
  }

  private _errorMessage(message: string) {
    this._notificationService.addNotification(message, ENotificationCode.error);
  }
}
