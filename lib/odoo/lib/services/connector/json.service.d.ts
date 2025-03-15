import { OdooRPCService } from 'angular-odoo-jsonrpc';
import { Observable, Subject } from 'rxjs';
import { BydPermissionsServices } from '@beyond/server';
import { BydNotificationService } from '@beyond/notification';
import * as i0 from "@angular/core";
export declare class OdooJsonConnector {
    private _odooRPC;
    readonly notificationService: BydNotificationService;
    readonly permissionsServices: BydPermissionsServices;
    readonly server: import("@beyond/odoo").IOdooServerConfig;
    readonly odooRPC: OdooRPCService;
    get proxyUrl(): string;
    get uid(): number | null;
    get pass(): string | null;
    private _tempAuthRequest;
    constructor(_odooRPC: OdooRPCService);
    login$(login: string, password: string): Observable<any>;
    searchCount$(model: string, param?: any): Subject<number>;
    private _handleRequest;
    private _handleErrorMessage;
    static ɵfac: i0.ɵɵFactoryDeclaration<OdooJsonConnector, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<OdooJsonConnector>;
}
