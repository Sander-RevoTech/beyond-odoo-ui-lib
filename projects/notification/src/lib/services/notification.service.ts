import { Injectable, InjectionToken } from '@angular/core';

import { Subject } from 'rxjs';

import { ENotificationCode } from '../enum';

// export const LAZY_SERVICE_TOKEN = new InjectionToken<TaNotificationService>('TaNotificationService');

@Injectable({
  providedIn: 'root',
})
export class BydNotificationService {
  public id = Math.random();

  public newNotification$ = new Subject<{
    message: string;
    code: ENotificationCode;
  }>();

  public errorNotification$ = new Subject<{
    message: string;
  }>();

  constructor() {}

  public addNotification(message: string, code: ENotificationCode) {
    this.newNotification$.next({ message, code });
  }

  public addErrorNotification(message: string) {
    this.errorNotification$.next({ message });
  }
}
