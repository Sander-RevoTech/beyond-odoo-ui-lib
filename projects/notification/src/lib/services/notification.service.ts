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

  constructor() {}

  public addNotification(message: string, code: ENotificationCode) {
    this.newNotification$.next({ message, code });
  }
}
