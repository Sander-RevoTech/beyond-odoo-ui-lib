import { BydPermissionsServices } from '@beyond/server';
import { Subject } from 'rxjs';
import { BydNotificationService } from '@beyond/notification';
import * as i0 from "@angular/core";
export interface OdooAuthenticateResponse {
    uid: number;
}
export declare class OdooJsonConnector {
    readonly notificationService: BydNotificationService;
    readonly permissionsServices: BydPermissionsServices;
    readonly server: import("@beyond/odoo").IOdooServerConfig;
    is_connected: boolean;
    get uid(): number | null;
    get pass(): string | null;
    get url(): string;
    get db(): string;
    constructor();
    login$(user: string, password: string): import("rxjs").Observable<number>;
    private _connectWithCredentials$;
    searchRead$<T>(model: string, domain: any[], fields?: Array<keyof T>, opts?: Record<string, any>): Subject<T[]>;
    private _call_kw;
    private _callWithUid;
    private _call$;
    private _extractResult;
    private _handleErrorMessage;
    static ɵfac: i0.ɵɵFactoryDeclaration<OdooJsonConnector, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<OdooJsonConnector>;
}
