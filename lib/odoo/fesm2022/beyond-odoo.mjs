import * as i0 from '@angular/core';
import { InjectionToken, inject, Injectable, NgZone } from '@angular/core';
import { getFirstString } from '@beyond/utils';
import * as i1 from 'angular-odoo-jsonrpc';
import { OdooRPCService } from 'angular-odoo-jsonrpc';
import { map, catchError, tap, Subject } from 'rxjs';
import * as xmlrpc from 'xmlrpc';
import { BydPermissionsServices, BydBaseService } from '@beyond/server';

const ODOO_SERVER_CONFIG_KEY = new InjectionToken('odoo-server-config');

class OdooJsonConnector {
    _odooRPC;
    server = inject(ODOO_SERVER_CONFIG_KEY);
    odooRPC = inject(OdooRPCService);
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

class OdooXmlConnector {
    server = inject(ODOO_SERVER_CONFIG_KEY);
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
    _permissionsService = inject(BydPermissionsServices);
    // private _notificationService: AppNotificationService;
    _tempAuthRequest = [];
    _oddObject;
    _oddCommon;
    _zone = inject(NgZone);
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
    login$(user, pass) {
        console.info('Getting UID');
        const subject$ = new Subject();
        this._oddCommon.methodCall('authenticate', [this.server.db, user, pass, { interactive: false, save_session: true }], (error, value) => this._zone.run(() => {
            if (error) {
                console.error(error);
                subject$.error(error);
                this._handleErrorMessage(error);
            }
            else {
                setTimeout(() => {
                    console.log('UID:', value);
                    this._permissionsService.set(value, pass);
                    subject$.next(value);
                    subject$.complete();
                    this._retryAuthRequest();
                }, 0);
            }
        }));
        return subject$;
    }
    searchCount(model, param) {
        console.info('Search & Count:', model);
        const subject$ = new Subject();
        return this._handleRequest(subject$, () => {
            this._oddObject.methodCall('execute_kw', [this.server.db, this.uid, this.pass, model, 'search_count', [param]], (error, value) => this._zone.run(() => {
                console.log('response Search & Read, ' + model);
                if (error) {
                    console.error(error);
                    subject$.error(error);
                    subject$.complete();
                    subject$.unsubscribe();
                    this._handleErrorMessage(error);
                }
                else {
                    console.log('response Search & Count, ', value);
                    subject$.next(value);
                    subject$.complete();
                    subject$.unsubscribe();
                }
            }));
        });
    }
    searchRead(model, param, keyword) {
        console.info('Search & Read:', model);
        const subject$ = new Subject();
        return this._handleRequest(subject$, () => {
            this._oddObject.methodCall('execute_kw', [this.server.db, this.uid, this.pass, model, 'search_read', [param], keyword], (error, value) => this._zone.run(() => {
                console.log('response Search & Read, ' + model);
                if (error) {
                    console.error(error);
                    subject$.error(error);
                    subject$.complete();
                    subject$.unsubscribe();
                    this._handleErrorMessage(error);
                }
                else {
                    console.log('response Search & Read, ', value);
                    subject$.next(value);
                    subject$.complete();
                    subject$.unsubscribe();
                }
            }));
        });
    }
    create(model, values, keyword) {
        console.info('Create on:', model, values);
        const subject$ = new Subject();
        return this._handleRequest(subject$, () => {
            this._oddObject.methodCall('execute_kw', [this.server.db, this.uid, this.pass, model, 'create', [values], keyword], (error, value) => this._zone.run(() => {
                if (error) {
                    console.log('Create, ' + error);
                    subject$.error(error);
                    subject$.complete();
                    subject$.unsubscribe();
                    this._handleErrorMessage(error);
                }
                else {
                    console.log('Create, ' + value);
                    subject$.next(value);
                    subject$.complete();
                    subject$.unsubscribe();
                }
            }));
        });
    }
    write(model, id, keyword) {
        console.info('Write on:', model, id, keyword);
        const subject$ = new Subject();
        return this._handleRequest(subject$, () => {
            this._oddObject.methodCall('execute_kw', [this.server.db, this.uid, this.pass, model, 'write', [[id], keyword]], (error, value) => this._zone.run(() => {
                if (error) {
                    console.info('Write error, ' + error);
                    subject$.error(error);
                    subject$.complete();
                    subject$.unsubscribe();
                    this._handleErrorMessage(error);
                }
                else {
                    console.log('Write, ' + value);
                    subject$.next(value);
                    subject$.complete();
                    subject$.unsubscribe();
                }
            }));
        });
    }
    delete(model, id) {
        console.info('Delete on:', model);
        const subject$ = new Subject();
        return this._handleRequest(subject$, () => {
            this._oddObject.methodCall('execute_kw', [this.server.db, this.uid, this.pass, model, 'unlink', [[id]]], (error, value) => this._zone.run(() => {
                if (error) {
                    console.info('Delete, ' + model);
                    subject$.error(error);
                    subject$.complete();
                    subject$.unsubscribe();
                    this._handleErrorMessage(error);
                }
                else {
                    console.log('Delete, ' + model + ' ' + value);
                    subject$.next(value);
                    subject$.complete();
                    subject$.unsubscribe();
                }
            }));
        });
    }
    custom(model, id, action, keyword) {
        console.log('Model:', model, 'Action:', action);
        const subject$ = new Subject();
        return this._handleRequest(subject$, () => {
            this._oddObject.methodCall('execute_kw', [this.server.db, this.uid, this.pass, model, action, keyword ? [[id], keyword] : [[id]]], (error, value) => this._zone.run(() => {
                if (error) {
                    console.error('Custom Action, ' + action + ' - ' + model);
                    subject$.error(error);
                    subject$.complete();
                    subject$.unsubscribe();
                    this._handleErrorMessage(error);
                }
                else {
                    console.log('Custom Action, ' + action + ' - ' + model);
                    subject$.next(value);
                    subject$.complete();
                    subject$.unsubscribe();
                }
            }));
        });
    }
    _handleRequest(subject$, request) {
        if (this.uid) {
            request();
        }
        else {
            console.log('Wait for Authuser');
            this._tempAuthRequest.push({ subject$: subject$, request: request });
        }
        return subject$;
    }
    _retryAuthRequest() {
        const list = [...this._tempAuthRequest];
        this._tempAuthRequest = [];
        this._retryRequest(list);
    }
    _retryRequest(list = []) {
        for (const request of list) {
            this._handleRequest(request.subject$, request.request);
        }
    }
    _handleErrorMessage(message) {
        const formattedMessage = message
            .toString()
            .replace('Error: Invalid XML-RPC', '')
            .replace('Error: XML-RPC fault:', '');
        // this._notificationService.addErrorNotification(formattedMessage);
    }
    _headers() {
        return { 'target-url': this.server.odooUrl };
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: OdooXmlConnector, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: OdooXmlConnector, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: OdooXmlConnector, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [] });

class BydBaseOdooService extends BydBaseService {
    _odooService = inject(OdooXmlConnector);
    _odooJsonService = inject(OdooJsonConnector);
    constructor() {
        super();
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

const apiRoutes = {
    Login: {
        type: 'POST',
        url: '{ApiUrl}/api/auth/local',
    },
};
class BydAuthOdooService extends BydBaseOdooService {
    permissionsServices = inject(BydPermissionsServices);
    constructor() {
        super();
        super.registerRoutes({
            apiRoutes
        });
    }
    login(data) {
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
