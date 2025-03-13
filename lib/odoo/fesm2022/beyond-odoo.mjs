import * as i0 from '@angular/core';
import { InjectionToken, inject, Injectable } from '@angular/core';
import { getFirstString } from '@beyond/utils';
import * as i1 from 'angular-odoo-jsonrpc';
import { OdooRPCService } from 'angular-odoo-jsonrpc';
import { map, catchError, tap } from 'rxjs';
import { BydPermissionsServices } from '@beyond/server';

const ODOO_SERVER_CONFIG_KEY = new InjectionToken('odoo-server-config');

class OdooJsonConnector {
    _odooRPC;
    server = inject(ODOO_SERVER_CONFIG_KEY);
    odooRPC = inject(OdooRPCService);
    get proxyUrl() {
        return this.server.proxyUrl + '/jsonrpc/';
    }
    get uid() {
        return "";
        // return Permissions.uid;
    }
    get pass() {
        return "";
        //return Permissions.pass;
    }
    _passTemp = null;
    constructor(_odooRPC) {
        this._odooRPC = _odooRPC;
        this._odooRPC.init({
            odoo_server: this.server.proxyUrl,
        });
    }
    login$(login, password) {
        console.info('Getting UID');
        return this._odooRPC.sendRequest('/web/session/authenticate', { db: this.server.db, login, password }).pipe(map((data) => {
            if (data.uid) {
                // Permissions.set(data.uid ?? null, password);
            }
            else {
                this._passTemp = password;
            }
            return data.uid;
        }), catchError(async (err) => {
            console.error('login failed', err);
            throw new Error("Username and password don't match");
        }));
    }
    totp$(totp_token) {
        console.info('Getting UID');
        return this._odooRPC.sendRequest('/web/session/totp', { totp_token }).pipe(tap((uid) => {
            console.log('totp uid:', uid);
            // Permissions.set(uid, this._passTemp ?? '');
        }), catchError(async (err) => console.error('login failed', err)));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: OdooJsonConnector, deps: [{ token: i1.OdooRPCService }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: OdooJsonConnector, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: OdooJsonConnector, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [{ type: i1.OdooRPCService }] });

class BydBaseOdooService {
    _odooService = inject(OdooJsonConnector);
    constructor() {
    }
    _handleJoinData(entity, props) {
        return props.reduce((entityFilled, prop) => {
            const linkProp = prop.from ? prop.from : prop.to.toString() + '_id';
            const list = entity[linkProp] || [];
            entityFilled[prop.to] = getFirstString(list);
            return entityFilled;
        }, entity);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydBaseOdooService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydBaseOdooService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydBaseOdooService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [] });

class BydAuthOdooService extends BydBaseOdooService {
    permissionsServices = inject(BydPermissionsServices);
    constructor() {
        super();
    }
    login$(data) {
        return this._odooService.login$(data.identifier, data.password);
    }
    logout() {
        this.permissionsServices.reset();
        location.reload();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydAuthOdooService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydAuthOdooService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydAuthOdooService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [] });

/*
 * Public API Surface of odoo
 */

/**
 * Generated bundle index. Do not edit.
 */

export { BydAuthOdooService, BydBaseOdooService, ODOO_SERVER_CONFIG_KEY };
//# sourceMappingURL=beyond-odoo.mjs.map
