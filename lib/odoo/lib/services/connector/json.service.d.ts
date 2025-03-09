import { OdooRPCService } from 'angular-odoo-jsonrpc';
import * as i0 from "@angular/core";
export declare class OdooJsonConnector {
    private _odooRPC;
    readonly server: import("@beyond/odoo").IOdooServerConfig;
    readonly odooRPC: OdooRPCService;
    get uid(): string;
    get pass(): string;
    private _passTemp;
    constructor(_odooRPC: OdooRPCService);
    login$(login: string, password: string): import("rxjs").Observable<any>;
    totp$(totp_token: string): import("rxjs").Observable<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<OdooJsonConnector, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<OdooJsonConnector>;
}
