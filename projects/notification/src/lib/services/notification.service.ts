import { Injectable, InjectionToken, signal } from '@angular/core';

import { Subject } from 'rxjs';

import { ENotificationCode } from '../enum';

// export const LAZY_SERVICE_TOKEN = new InjectionToken<TaNotificationService>('TaNotificationService');

@Injectable({
  providedIn: 'root',
})
export class BydNotificationService {
  public id = Math.random();

  readonly pendingBlockedRequest = signal<number>(0);

  public newNotification$ = new Subject<{
    message: string;
    code: ENotificationCode;
    options?: { focused?: boolean };
  }>();

  public errorNotification$ = new Subject<{
    message: string;
  }>();

  public userNotification$ = new Subject<{
    message: string;
  }>();
  public clearUserNotification$ = new Subject();

  constructor() {}

  public incPendingBlockedRequest() {
    this.pendingBlockedRequest.set(this.pendingBlockedRequest() + 1);
  }
  public decPendingBlockedRequest() {
    this.pendingBlockedRequest.set(this.pendingBlockedRequest() - 1);
  }
  public addNotification(message: string, code: ENotificationCode, options?: { focused?: boolean }) {
    this.newNotification$.next({ message, code, options });
  }

  public addErrorNotification(message: string) {
    this.errorNotification$.next({ message });
  }

  public addUserNotification(message: string) {
    this.userNotification$.next({ message });
  }
}
