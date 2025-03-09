import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
export declare class OdooXmlConnector {
    readonly server: import("@beyond/odoo").IOdooServerConfig;
    get proxyUrl(): string;
    get uid(): string;
    get pass(): string;
    private readonly _permissionsService;
    private _tempAuthRequest;
    private _oddObject;
    private _oddCommon;
    private _zone;
    constructor();
    login$(user: string, pass: string): Subject<unknown>;
    searchCount(model: string, param?: any): Subject<number>;
    searchRead<T, K = T>(model: string, param?: any, keyword?: {
        fields: Array<keyof K>;
        limit?: any;
    }): Subject<T>;
    create<T>(model: string, values: T, keyword: {
        [key in keyof T]?: any;
    }): any;
    write<T>(model: string, id: number, keyword: {
        [key in keyof T]?: any;
    }): Subject<T>;
    delete(model: string, id: number): Subject<string>;
    custom<T>(model: string, id: number, action: string, keyword?: any): Subject<T>;
    private _handleRequest;
    private _retryAuthRequest;
    private _retryRequest;
    private _handleErrorMessage;
    private _headers;
    static ɵfac: i0.ɵɵFactoryDeclaration<OdooXmlConnector, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<OdooXmlConnector>;
}
