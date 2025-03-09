import { Injectable, NgZone, inject } from '@angular/core';

import { Subject } from 'rxjs';
import * as xmlrpc from 'xmlrpc';
import { ODOO_SERVER_CONFIG_KEY } from '../../injectionToken';
import { BydPermissionsServices } from '@beyond/server';

// import { AppNotificationService } from 'src/app/services/notification/notification.service';
// import { Permissions } from 'src/app/services/user/permissions';
// import { environment } from 'src/environments/environment';

/*
 * Odoo Connector Service by Moldeo Interactive
 * Angular 8+
 * Requires xmlrpc - npm i xmlrpc
 *
 * Developer: Ignacio Buioli <ibuioli@gmail.com>
 * Company: Codize <www.codize.ar>
 * https://github.com/codize-app/ng-odoo-connect
 */

type pendingRequest = Array<{ subject$: Subject<any>; request: () => void }>;

@Injectable({
  providedIn: 'root',
})
export class OdooXmlConnector {

  readonly server = inject(ODOO_SERVER_CONFIG_KEY);

  get proxyUrl() {
    return this.server.proxyUrl + '/xmlrpc/2/';
  }
  get uid() {
    return "";
    //return Permissions.uid;
  }
  get pass() {
    return "";
    //return Permissions.pass;
  }

  private readonly _permissionsService = inject(BydPermissionsServices);

 // private _notificationService: AppNotificationService;
  private _tempAuthRequest: pendingRequest = [];

  private _oddObject;
  private _oddCommon;
  private _zone = inject(NgZone);

  constructor() {
    this._oddObject = xmlrpc.createClient({
      url: this.proxyUrl + 'object',
      headers: this._headers(),
      cookies: true,
    });
    this._oddCommon = xmlrpc.createClient({
      url: this.proxyUrl + 'common',
      headers: this._headers(),
    });
  }

  // public data() {
  //   console.info('Getting Odoo Data');

  //   const odoo$ = new Observable(observer => {
  //     this._oddCommon.methodCall('version', [], (error: any, value: any) =>
  //       this._zone.run(() => {
  //         if (error) {
  //           console.error(error);
  //           observer.error(error);
  //         } else {
  //           console.log('Odoo Data:', value);
  //           observer.next(value);
  //           observer.complete();
  //         }
  //       })
  //     );
  //   });

  //   return odoo$;
  // }

  public login$(user: string, pass: string) {
    console.info('Getting UID');

    const subject$ = new Subject();

    this._oddCommon.methodCall(
      'authenticate',
      [this.server.db, user, pass, { interactive: false, save_session: true }],
      (error: any, value: any) =>
        this._zone.run(() => {
          if (error) {
            console.error(error);
            subject$.error(error);
            this._handleErrorMessage(error);
          } else {
            setTimeout(() => {
              console.log('UID:', value);
              this._permissionsService.set(value, pass);

              subject$.next(value);
              subject$.complete();

              this._retryAuthRequest();
            }, 0);
          }
        })
    );

    return subject$;
  }

  public searchCount(model: string, param?: any) {
    console.info('Search & Count:', model);

    const subject$ = new Subject<number>();

    return this._handleRequest<number>(subject$, () => {
      this._oddObject.methodCall(
        'execute_kw',
        [this.server.db, this.uid, this.pass, model, 'search_count', [param]],
        (error: any, value: number) =>
          this._zone.run(() => {
            console.log('response Search & Read, ' + model);
            if (error) {
              console.error(error);
              subject$.error(error);
              subject$.complete();
              subject$.unsubscribe();
              this._handleErrorMessage(error);
            } else {
              console.log('response Search & Count, ', value);
              subject$.next(value);
              subject$.complete();
              subject$.unsubscribe();
            }
          })
      );
    });
  }

  public searchRead<T, K = T>(model: string, param?: any, keyword?: { fields: Array<keyof K>; limit?: any }) {
    console.info('Search & Read:', model);

    const subject$ = new Subject<T>();

    return this._handleRequest<T>(subject$, () => {
      this._oddObject.methodCall(
        'execute_kw',
        [this.server.db, this.uid, this.pass, model, 'search_read', [param], keyword],
        (error: any, value: T) =>
          this._zone.run(() => {
            console.log('response Search & Read, ' + model);
            if (error) {
              console.error(error);
              subject$.error(error);
              subject$.complete();
              subject$.unsubscribe();
              this._handleErrorMessage(error);
            } else {
              console.log('response Search & Read, ', value);
              subject$.next(value);
              subject$.complete();
              subject$.unsubscribe();
            }
          })
      );
    });
  }

  public create<T>(model: string, values: T, keyword: { [key in keyof T]?: any }): any {
    console.info('Create on:', model, values);

    const subject$ = new Subject<T>();

    return this._handleRequest<T>(subject$, () => {
      this._oddObject.methodCall(
        'execute_kw',
        [this.server.db, this.uid, this.pass, model, 'create', [values], keyword],
        (error: any, value: any) =>
          this._zone.run(() => {
            if (error) {
              console.log('Create, ' + error);
              subject$.error(error);
              subject$.complete();
              subject$.unsubscribe();
              this._handleErrorMessage(error);
            } else {
              console.log('Create, ' + value);
              subject$.next(value);
              subject$.complete();
              subject$.unsubscribe();
            }
          })
      );
    });
  }

  public write<T>(model: string, id: number, keyword: { [key in keyof T]?: any }) {
    console.info('Write on:', model, id, keyword);

    const subject$ = new Subject<T>();

    return this._handleRequest<T>(subject$, () => {
      this._oddObject.methodCall(
        'execute_kw',
        [this.server.db, this.uid, this.pass, model, 'write', [[id], keyword]],
        (error: any, value: any) =>
          this._zone.run(() => {
            if (error) {
              console.info('Write error, ' + error);
              subject$.error(error);
              subject$.complete();
              subject$.unsubscribe();
              this._handleErrorMessage(error);
            } else {
              console.log('Write, ' + value);
              subject$.next(value);
              subject$.complete();
              subject$.unsubscribe();
            }
          })
      );
    });
  }

  public delete(model: string, id: number) {
    console.info('Delete on:', model);
    const subject$ = new Subject<string>();

    return this._handleRequest<string>(subject$, () => {
      this._oddObject.methodCall(
        'execute_kw',
        [this.server.db, this.uid, this.pass, model, 'unlink', [[id]]],
        (error: any, value: any) =>
          this._zone.run(() => {
            if (error) {
              console.info('Delete, ' + model);
              subject$.error(error);
              subject$.complete();
              subject$.unsubscribe();
              this._handleErrorMessage(error);
            } else {
              console.log('Delete, ' + model + ' ' + value);
              subject$.next(value);
              subject$.complete();
              subject$.unsubscribe();
            }
          })
      );
    });
  }

  public custom<T>(model: string, id: number, action: string, keyword?: any) {
    console.log('Model:', model, 'Action:', action);

    const subject$ = new Subject<T>();

    return this._handleRequest<T>(subject$, () => {
      this._oddObject.methodCall(
        'execute_kw',
        [this.server.db, this.uid, this.pass, model, action, keyword ? [[id], keyword] : [[id]]],
        (error: any, value: any) =>
          this._zone.run(() => {
            if (error) {
              console.error('Custom Action, ' + action + ' - ' + model);
              subject$.error(error);
              subject$.complete();
              subject$.unsubscribe();
              this._handleErrorMessage(error);
            } else {
              console.log('Custom Action, ' + action + ' - ' + model);
              subject$.next(value);
              subject$.complete();
              subject$.unsubscribe();
            }
          })
      );
    });
  }

  private _handleRequest<T>(subject$: Subject<T>, request: () => void): Subject<T> {
    if (this.uid) {
      request();
    } else {
      console.log('Wait for Authuser');
      this._tempAuthRequest.push({ subject$: subject$, request: request });
    }

    return subject$;
  }

  private _retryAuthRequest() {
    const list = [...this._tempAuthRequest];
    this._tempAuthRequest = [];

    this._retryRequest(list);
  }

  private _retryRequest(list: pendingRequest = []) {
    for (const request of list) {
      this._handleRequest(request.subject$, request.request);
    }
  }

  private _handleErrorMessage(message: any) {
    const formattedMessage = message
      .toString()
      .replace('Error: Invalid XML-RPC', '')
      .replace('Error: XML-RPC fault:', '');
   // this._notificationService.addErrorNotification(formattedMessage);
  }

  private _headers(): { [header: string]: string } {
    return { 'target-url': this.server.odooUrl };
  }

  // public fieldsGet(model: string, keyword?: any): any {
  //   console.info('Fields get on:', model);
  //   const object = xmlrpc.createClient(this.server.proxyUrl + 'object');
  //   const odoo$ = new Observable(observer => {
  //     object.methodCall('execute_kw',
  //     [this.server.db, this.uid, this.pass, model, 'fields_get', [keyword]], (error: any, value: any) => this._zone.run(() => {
  //       if (error) {
  //         console.info('Fields get, ' + model);
  //         console.error(error);
  //         observer.error(error);
  //       } else {
  //         console.log('Fields get, ' + model);
  //         observer.next(value);
  //         observer.complete();
  //       }
  //     });
  //   });

  //   return odoo$;
  // }
}
