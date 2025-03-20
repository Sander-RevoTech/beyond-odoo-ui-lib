import { inject, Injectable } from '@angular/core';
import { BydPermissionsServices } from '@beyond/server';
import { BehaviorSubject, map, Subject, tap } from 'rxjs';
import { ODOO_SERVER_CONFIG_KEY } from '../../injectionToken';
import { BydNotificationService, ENotificationCode } from '@beyond/notification';

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

  public is_connected = false;

  get uid() {
    return this.permissionsServices.uid;
  }
  get pass() {
    return this.permissionsServices.pass;
  }

  get url(): string {
    return this.server.proxyUrl;
  }
  get db(): string {
    return this.server.db;
  }

  constructor() { }

  public login$(user: string, password: string) {
    console.info('Getting UID');
    return this._connectWithCredentials$(user, password).pipe(
      tap((result) => {
        this.permissionsServices.set(result.uid, password);

        this.is_connected = true;
      }),
      map((result) => result.uid),
    );
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

  public searchRead$<T>(
    model: string,
    domain: any[],
    fields: Array<keyof T> = [],
    opts: Record<string, any> = {}
  ) {
    console.info('Search & Count:', model);
    return this._call_kw<T[]>(model, 'search_read', [domain, fields], opts);
  }

  private _call_kw<T>(model: string, method: string, args: any[], kwargs: Record<string, any> = {}) {
    return this._callWithUid<T>(model, method, args, kwargs);
  }

  private _callWithUid<T>(
    model: string,
    method: string,
    args: any[],
    kwargs: Record<string, any> = {}
  ) {
    const endpoint = `${this.url}/jsonrpc`;
    const params = {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        service: 'object',
        method: 'execute_kw',
        args: [this.db, this.uid, this.pass, model, method, args, kwargs],
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
      },
      body: JSON.stringify(params),
    }).then((response) => {
      this._extractResult<T>(response).then((result) => {
        console.log('response, ', result);
        subject$.next(result);
        subject$.complete();
        subject$.unsubscribe();
      }).catch((error) => {
        subject$.error(error);
        subject$.complete();
        subject$.unsubscribe();
        this._handleErrorMessage(error);
      })
    });

    return subject$;
  }

  private async _extractResult<T>(response: any) {
    if (!response || !response.ok) {
      throw new Error(response?.statusText || 'Connection Error');
    }

    const body = <{result: T}>await response.json();

    return body.result;
  }

    private _handleErrorMessage(message: any) {
      const formattedMessage = message
        .toString()
        .replace('Error: Invalid XML-RPC', '')
        .replace('Error: XML-RPC fault:', '');
      this.notificationService.addNotification(formattedMessage, ENotificationCode.error);
    }

  /**
   *
   * out
   */


  // // Méthodes pratiques pour les opérations CRUD
  // async create(model: string, values: Record<string, any>): Promise<number> {
  //   return this.call_kw(model, 'create', [values]);
  // }

  // async read(model: string, id: number | number[], fields: string[] = []): Promise<any> {
  //   return this.call_kw(model, 'read', [id, fields]);
  // }

  // async update(model: string, id: number, values: Record<string, any>): Promise<boolean> {
  //   return this.call_kw(model, 'write', [[id], values]);
  // }

  // async delete(model: string, id: number): Promise<boolean> {
  //   return this.call_kw(model, 'unlink', [[id]]);
  // }



  // async search(model: string, domain: any[]): Promise<number[]> {
  //   return (await this.call_kw(model, 'search', [domain])) || [];
  // }

  // async action(model: string, action: string, ids: number[]): Promise<any> {
  //   return this.call_kw(model, action, ids);
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
