import * as i0 from '@angular/core';
import { InjectionToken, inject, Injectable } from '@angular/core';
import { getFirstString } from '@beyond/utils';
import * as i1 from 'angular-odoo-jsonrpc';
import { OdooRPCService } from 'angular-odoo-jsonrpc';
import { map, catchError, Subject, tap, take } from 'rxjs';
import { BydPermissionsServices } from '@beyond/server';
import { BydNotificationService, ENotificationCode } from '@beyond/notification';

const ODOO_SERVER_CONFIG_KEY = new InjectionToken('odoo-server-config');

class OdooJsonConnector {
    _odooRPC;
    notificationService = inject(BydNotificationService);
    permissionsServices = inject(BydPermissionsServices);
    server = inject(ODOO_SERVER_CONFIG_KEY);
    odooRPC = inject(OdooRPCService);
    get proxyUrl() {
        return this.server.proxyUrl + '/jsonrpc/';
    }
    get uid() {
        return this.permissionsServices.uid;
    }
    get pass() {
        return this.permissionsServices.pass;
    }
    _tempAuthRequest = [];
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
                this.permissionsServices.set(data.uid ?? null, password);
            }
            return data.uid;
        }), catchError(async (err) => {
            console.error('login failed', err);
            throw new Error("Username and password don't match");
        }));
    }
    searchCount$(model, param) {
        console.info('Search & Count:', model);
        const subject$ = new Subject();
        return this._handleRequest(subject$, this._odooRPC.call(model, 'search_count', [this.server.db, this.uid, this.pass], [param]).pipe(tap((value) => {
            console.log('response Search & Count, ', value);
            subject$.next(value);
            subject$.complete();
            subject$.unsubscribe();
        }), catchError(async (error) => {
            console.error(error);
            subject$.error(error);
            subject$.complete();
            subject$.unsubscribe();
            this._handleErrorMessage(error);
        })));
    }
    _handleRequest(subject$, request$) {
        if (this.uid) {
            request$.pipe(take(1)).subscribe();
        }
        else {
            console.log('Wait for Authuser');
            this._tempAuthRequest.push({ subject$: subject$, request$: request$ });
        }
        return subject$;
    }
    _handleErrorMessage(message) {
        const formattedMessage = message
            .toString()
            .replace('Error: Invalid XML-RPC', '')
            .replace('Error: XML-RPC fault:', '');
        this.notificationService.addNotification(formattedMessage, ENotificationCode.error);
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
