import { Injectable, inject } from '@angular/core';

import { BydNotificationService, ENotificationCode } from '@beyond/notification';
import { BydPermissionsServices } from '@beyond/server';
import odoo from '@fernandoslim/odoo-jsonrpc';
import { OdooRPCService } from 'angular-odoo-jsonrpc';
import { Observable, Subject, catchError, map, take, tap } from 'rxjs';

import { ODOO_SERVER_CONFIG_KEY } from '../../injectionToken';

type pendingRequest = Array<{ subject$: Subject<any>; request$: Observable<unknown> }>;

@Injectable({
  providedIn: 'root',
})
export class OdooJsonConnector {
  readonly notificationService = inject(BydNotificationService);
  readonly permissionsServices = inject(BydPermissionsServices);

  readonly server = inject(ODOO_SERVER_CONFIG_KEY);
  readonly odooRPC = inject(OdooRPCService);

  // readonly odooJSON = new OdooJSONRpc({
  //   baseUrl: this.server.proxyUrl,
  //   db: this.server.db,
  // });

  get uid() {
    return this.permissionsServices.uid;
  }
  get pass() {
    return this.permissionsServices.pass;
  }

  private _tempAuthRequest: pendingRequest = [];

  constructor() {
    const odoo2 = new odoo();
    this.odooRPC.init({
      odoo_server: this.server.proxyUrl,
    });
  }

  public login$(login: string, password: string) {
    console.info('Getting UID');

    return this.odooRPC.login(this.server.db, login, password).pipe(
      map(data => {
        if (data.uid) {
          this.permissionsServices.set(data.uid, password, data.session_id);
        }
        this.odooRPC.setHttpAuth(`${login}:${password}`);
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

    return this._handleRequest<number>(
      subject$,
      this.odooRPC.call<number>(model, 'search_count', [], {}).pipe(
        tap((value: number) => {
          console.log('response Search & Count, ', value);
          subject$.next(value);
          subject$.complete();
          subject$.unsubscribe();
        }),
        catchError(async error => {
          console.error(error);
          subject$.error(error);
          subject$.complete();
          subject$.unsubscribe();
          this._handleErrorMessage(error);
        })
      )
    );
  }

  public searchRead$<T, K = T>(model: string, param?: any, keyword?: { fields: Array<keyof K>; limit?: any }) {
    console.info('Search & Count:', model);

    const subject$ = new Subject<T[]>();

    return this._handleRequest<T[]>(
      subject$,
      this.odooRPC.searchRead<T>(model).pipe(
        tap(value => {
          console.log('response Search & Count, ', value);
          subject$.next(value.records);
          subject$.complete();
          subject$.unsubscribe();
        }),
        catchError(async error => {
          console.error(error);
          subject$.error(error);
          subject$.complete();
          subject$.unsubscribe();
          this._handleErrorMessage(error);
        })
      )
    );
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

  private _headers(): { [header: string]: string } {
    return { 'target-url': this.server.odooUrl };
  }
}
