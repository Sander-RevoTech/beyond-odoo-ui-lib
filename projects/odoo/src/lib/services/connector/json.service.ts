import { Injectable, inject } from '@angular/core';

import { BydNotificationService } from '@beyond/notification';
import { BydPermissionsServices } from '@beyond/server';
import { Subject, catchError, map, of, tap } from 'rxjs';

import { ODOO_SERVER_CONFIG_KEY } from '../../injectionToken';

export interface OdooAuthenticateResponse {
  uid: number;
}

@Injectable({
  providedIn: 'root',
})
export class OdooJsonConnector {
  readonly notificationService = inject(BydNotificationService);
  readonly permissionsServices = inject(BydPermissionsServices);
  readonly server = inject(ODOO_SERVER_CONFIG_KEY);

  get uid() {
    return this.permissionsServices.hasRole('shared') ? '%%COMMON_ID%%' : this.permissionsServices.uid;
  }
  get pass() {
    return this.permissionsServices.hasRole('shared') ? '%%COMMON_PASS%%' : this.permissionsServices.pass;
  }

  get url(): string {
    return this.server.proxyUrl;
  }
  get db(): string {
    return this.server.db;
  }

  constructor() {}

  public login$(user: string | null, password: string) {
    console.info('Getting UID');
    if (!user) {
      this.permissionsServices.set(2, password);
      return this.searchCount$('res.users', [['id', '=', 2]]).pipe(
        map(() => 2),
        catchError(err => {
          this.permissionsServices.reset();
          return of(err.message);
        })
      );
    }
    return this._connectWithCredentials$(user, password).pipe(
      tap(result => {
        this.permissionsServices.set(result.uid, password);
      }),
      map(result => result.uid)
    );
  }

  public getSessionInfo$() {
    const endpoint = `${this.url}/web/session/get_session_info`;
    const params = {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        db: this.db,
        uid: this.permissionsServices.uid,
        password: this.permissionsServices.pass,
      },
      id: new Date().getTime(),
    };

    return this._call$<OdooAuthenticateResponse>(endpoint, params);
  }

  // Connexion avec identifiants
  private _connectWithCredentials$(user: string, password: string) {
    const endpoint = `${this.url}/web/session/authenticate`;
    const params = {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        db: this.db,
        login: user,
        password: password,
      },
      id: new Date().getTime(),
    };

    return this._call$<OdooAuthenticateResponse>(endpoint, params);
  }

  public searchCount$(model: string, domain: any[], opts: Record<string, any> = {}) {
    console.info('Search & Count:', model);
    return this._call_kw$<number>(model, 'search_count', [domain], opts);
  }
  public searchRead$<T>(model: string, domain: any[], fields: Array<keyof T> = [], opts: Record<string, any> = {}) {
    console.info('Search & Read:', model);
    return this._call_kw$<T[]>(model, 'search_read', [domain, fields], opts);
  }
  public searchReadAndGroup$<T>(
    model: string,
    domain: any[],
    fields: Array<keyof T> = [],
    groups: Array<keyof T> = [],
    opts: Record<string, any> = {}
  ) {
    console.info('Search & Read - Group:', model);
    return this._call_kw$<T[]>(model, 'read_group', [domain, fields, groups], opts);
  }

  public create$<T>(model: string, values: Record<string, any>) {
    return this._call_kw$<T>(model, 'create', [values]);
  }

  public write$<T>(model: string, id: number, values: Record<string, any>) {
    return this._call_kw$<T>(model, 'write', [[id], values]);
  }

  public delete$(model: string, id: number) {
    return this._call_kw$<boolean>(model, 'unlink', [[id]]);
  }

  public action$<T>(model: string, action: string, id: number, context?: Record<string, any>) {
    return this._call_kw$<T>(model, action, [[id]], context);
  }

  private _call_kw$<T>(model: string, method: string, args: any[], kwargs: Record<string, any> = {}) {
    return this._callWithUid<T>(model, method, args, kwargs);
  }

  private _callWithUid<T>(model: string, method: string, args: any[], kwargs: Record<string, any> = {}) {
    const endpoint = `${this.url}/jsonrpc`;
    const params = {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        service: 'object',
        method: 'execute_kw',
        args: [
          this.db,
          this.uid,
          this.pass,
          model,
          method,
          args,
          kwargs, // { ...kwargs, ...{ context: { company_id: this.permissionsServices.compagnies } } },
        ],
      },
      id: new Date().getTime(),
    };

    return this._call$<T>(endpoint, params);
  }

  private _call$<T>(endpoint: string, params: any) {
    const subject$ = new Subject<T>();
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'target-url': this.server.odooUrl,
      },
      body: JSON.stringify(params),
    }).then(response => {
      this._extractResult<T>(response)
        .then(result => {
          console.log('response, ', result);
          subject$.next(result);
          subject$.complete();
          subject$.unsubscribe();
        })
        .catch(error => {
          subject$.error(error);
          subject$.complete();
          subject$.unsubscribe();
          //this._handleErrorMessage(error);
        });
    });

    return subject$;
  }

  private async _extractResult<T>(response: any) {
    if (!response || !response.ok) {
      throw new Error(response?.statusText || 'Connection Error');
    }

    const body = <{ result: T; error: { data: { message: string } } }>await response.json();

    if (body.error) {
      this._handleErrorMessage(body.error.data.message);
      throw new Error(body.error.data.message);
    }
    return body.result;
  }

  private _handleErrorMessage(message: any) {
    const formattedMessage = message
      .toString()
      .replace('Error: Invalid XML-RPC', '')
      .replace('Error: XML-RPC fault:', '');
    this.notificationService.addErrorNotification(formattedMessage);
  }

  /**
   *
   * out
   */

  // // Méthodes pratiques pour les opérations CRUD

  // async read(model: string, id: number | number[], fields: string[] = []): Promise<any> {
  //   return this.call_kw(model, 'read', [id, fields]);
  // }

  // async search(model: string, domain: any[]): Promise<number[]> {
  //   return (await this.call_kw(model, 'search', [domain])) || [];
  // }

  // async disconnect(): Promise<boolean> {
  //   if (!this.is_connected) {
  //     return true;
  //   }

  //   const endpoint = `${this.url}/web/session/destroy`;
  //   const params = {
  //     jsonrpc: '2.0',
  //     method: 'call',
  //     params: {},
  //     id: new Date().getTime(),
  //   };

  //   const headers: Record<string, string> = {
  //     'Content-Type': 'application/json',
  //   };

  //   const response = await fetch(endpoint, {
  //       method: 'POST',
  //       headers,
  //       body: JSON.stringify(params),
  //     });

  //   const body = await response.json();

  //   this.is_connected = false;
  //   this.auth_response = null;
  //   this.permissionsServices.reset();
  //   this.connectionState.next(false);
  //   return true;
  // }
}
