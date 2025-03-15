import { inject, Injectable } from '@angular/core';

import { OdooRPCService } from 'angular-odoo-jsonrpc';
import { catchError, map, Observable, Subject, take, tap } from 'rxjs';

import { ODOO_SERVER_CONFIG_KEY } from '../../injectionToken';
import { BydPermissionsServices } from '@beyond/server';
import { BydNotificationService, ENotificationCode } from '@beyond/notification';

type pendingRequest = Array<{ subject$: Subject<any>; request$: Observable<unknown> }>;

@Injectable({
  providedIn: 'root',
})
export class OdooJsonConnector {
  readonly notificationService = inject(BydNotificationService);
  readonly permissionsServices = inject(BydPermissionsServices);

  readonly server = inject(ODOO_SERVER_CONFIG_KEY);
  readonly odooRPC = inject(OdooRPCService);

  get proxyUrl() {
    return this.server.proxyUrl + '/jsonrpc/';
  }
  get uid() {
   return this.permissionsServices.uid;
  }
  get pass() {
    return this.permissionsServices.pass;
  }

  private _tempAuthRequest: pendingRequest = [];


  constructor(private _odooRPC: OdooRPCService) {

    this._odooRPC.init({
      odoo_server: this.server.proxyUrl,
    });
  }

  public login$(login: string, password: string) {
    console.info('Getting UID');

    return this._odooRPC.sendRequest('/web/session/authenticate', { db: this.server.db, login, password }).pipe(
      map((data: any) => {
        if (data.uid) {
         this.permissionsServices.set(data.uid ?? null, password);
        }

        return data.uid;
      }),
      catchError(async err => {
        console.error('login failed', err);
        throw new Error("Username and password don't match");
      })
    );
  }

  public searchCount$(model: string, param?: any) {
    console.info('Search & Count:', model);

    const subject$ = new Subject<number>();

    return this._handleRequest<number>(subject$, this._odooRPC.call<number>(
        model,
        'search_count',
        [this.server.db, this.uid, this.pass],
        [param]).pipe(tap((value: number) => {
              console.log('response Search & Count, ', value);
              subject$.next(value);
              subject$.complete();
              subject$.unsubscribe();
            }
        ),
        catchError(async error => {
            console.error(error);
              subject$.error(error);
              subject$.complete();
              subject$.unsubscribe();
              this._handleErrorMessage(error);
        })
      ));


  }


  private _handleRequest<T>(subject$: Subject<T>, request$: Observable<unknown>): Subject<T> {
    if (this.uid) {
      request$.pipe(take(1)).subscribe();
    } else {
      console.log('Wait for Authuser');
      this._tempAuthRequest.push({ subject$: subject$, request$: request$ });
    }

    return subject$;
  }

  private _handleErrorMessage(message: any) {
    const formattedMessage = message
      .toString()
      .replace('Error: Invalid XML-RPC', '')
      .replace('Error: XML-RPC fault:', '');
    this.notificationService.addNotification(formattedMessage, ENotificationCode.error);
  }
}
