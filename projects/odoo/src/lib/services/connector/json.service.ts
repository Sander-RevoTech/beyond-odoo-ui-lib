import { inject, Injectable } from '@angular/core';

import { OdooRPCService } from 'angular-odoo-jsonrpc';
import { catchError, map, tap } from 'rxjs';

// import { Permissions } from 'src/app/services/user/permissions';
// import { environment } from 'src/environments/environment';
import { ODOO_SERVER_CONFIG_KEY } from '../../injectionToken';

@Injectable({
  providedIn: 'root',
})
export class OdooJsonConnector {
  readonly server = inject(ODOO_SERVER_CONFIG_KEY);
  readonly odooRPC = inject(OdooRPCService);

  get uid() {
    return "";
   // return Permissions.uid;
  }
  get pass() {
    return "";

    //return Permissions.pass;
  }

  private _passTemp: string | null = null;

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
         // Permissions.set(data.uid ?? null, password);
        } else {
          this._passTemp = password;
        }

        return data.uid;
      }),
      catchError(async err => {
        console.error('login failed', err);
        throw new Error("Username and password don't match");
      })
    );
  }

  public totp$(totp_token: string) {
    console.info('Getting UID');

    return this._odooRPC.sendRequest('/web/session/totp', { totp_token }).pipe(
      tap((uid: any) => {
        console.log('totp uid:', uid);
       // Permissions.set(uid, this._passTemp ?? '');
      }),
      catchError(async err => console.error('login failed', err))
    );
  }
}
