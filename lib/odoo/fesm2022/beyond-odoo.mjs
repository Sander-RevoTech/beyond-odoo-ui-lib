import { HTTP_INTERCEPTORS } from '@angular/common/http';
import * as i0 from '@angular/core';
import { InjectionToken, inject, Injectable } from '@angular/core';
import { getFirstString } from '@beyond/utils';
import { BydPermissionsServices } from '@beyond/server';
import { tap, map, Subject } from 'rxjs';
import { BydNotificationService, ENotificationCode } from '@beyond/notification';

const ODOO_SERVER_CONFIG_KEY = new InjectionToken('odoo-server-config');

class TargetUrlInterceptor {
    server = inject(ODOO_SERVER_CONFIG_KEY);
    constructor() { }
    intercept(req, next) {
        return next.handle(req.clone({
            headers: req.headers.set('target-url', this.server.odooUrl)
        }));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: TargetUrlInterceptor, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: TargetUrlInterceptor });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: TargetUrlInterceptor, decorators: [{
            type: Injectable
        }], ctorParameters: () => [] });

const provideOdoo = () => [
    {
        provide: HTTP_INTERCEPTORS,
        useClass: TargetUrlInterceptor,
        multi: true
    },
];

class OdooJsonConnector {
    notificationService = inject(BydNotificationService);
    permissionsServices = inject(BydPermissionsServices);
    server = inject(ODOO_SERVER_CONFIG_KEY);
    get uid() {
        return this.permissionsServices.uid;
    }
    get pass() {
        return this.permissionsServices.pass;
    }
    get url() {
        return this.server.proxyUrl;
    }
    get db() {
        return this.server.db;
    }
    constructor() { }
    login$(user, password) {
        console.info('Getting UID');
        return this._connectWithCredentials$(user, password).pipe(tap((result) => {
            this.permissionsServices.set(result.uid, password);
            this.permissionsServices.setAuthenticated(true);
        }), map((result) => result.uid));
    }
    // Connexion avec identifiants
    _connectWithCredentials$(user, password) {
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
        return this._call$(endpoint, params);
    }
    searchCount$(model, domain, opts = {}) {
        console.info('Search & Count:', model);
        return this._call_kw$(model, 'search_count', [domain], opts);
    }
    searchRead$(model, domain, fields = [], opts = {}) {
        console.info('Search & Read:', model);
        return this._call_kw$(model, 'search_read', [domain, fields], opts);
    }
    create$(model, values) {
        return this._call_kw$(model, 'create', [values]);
    }
    write$(model, id, values) {
        return this._call_kw$(model, 'write', [[id], values]);
    }
    delete$(model, id) {
        return this._call_kw$(model, 'unlink', [[id]]);
    }
    action$(model, action, ids) {
        return this._call_kw$(model, action, ids);
    }
    _call_kw$(model, method, args, kwargs = {}) {
        return this._callWithUid(model, method, args, kwargs);
    }
    _callWithUid(model, method, args, kwargs = {}) {
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
        return this._call$(endpoint, params);
    }
    _call$(endpoint, params) {
        const subject$ = new Subject();
        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
        }).then((response) => {
            this._extractResult(response).then((result) => {
                console.log('response, ', result);
                subject$.next(result);
                subject$.complete();
                subject$.unsubscribe();
            }).catch((error) => {
                subject$.error(error);
                subject$.complete();
                subject$.unsubscribe();
                this._handleErrorMessage(error);
            });
        });
        return subject$;
    }
    async _extractResult(response) {
        if (!response || !response.ok) {
            throw new Error(response?.statusText || 'Connection Error');
        }
        const body = await response.json();
        if (body.error) {
            throw new Error(body.error.data.message);
        }
        return body.result;
    }
    _handleErrorMessage(message) {
        const formattedMessage = message
            .toString()
            .replace('Error: Invalid XML-RPC', '')
            .replace('Error: XML-RPC fault:', '');
        this.notificationService.addNotification(formattedMessage, ENotificationCode.error);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: OdooJsonConnector, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: OdooJsonConnector, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: OdooJsonConnector, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [] });

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

export { BydAuthOdooService, BydBaseOdooService, ODOO_SERVER_CONFIG_KEY, TargetUrlInterceptor, provideOdoo };
//# sourceMappingURL=beyond-odoo.mjs.map
