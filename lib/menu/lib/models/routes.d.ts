import { ActivatedRouteSnapshot } from '@angular/router';
export declare enum BydMainRoute {
    HOME = "HOME",
    USERLOGIN = "USERLOGIN",
    USERLOGOUT = "USERLOGOUT"
}
export interface IRoute {
    key: string;
    url: string;
    canActivate?: boolean;
    children?: IRoute[];
}
export declare class BydRoutesCore {
    routes: IRoute[];
    constructor();
    addRoute(route: IRoute): void;
    addRoutes(routes: IRoute[]): void;
    getHome(): string;
    getLogin(): string;
    getLogout(): string;
    getUrl(eNums: string[], params?: {}, strict?: boolean): string;
    getAbsoluteUrl<T>(eNums: string[], params?: T, queryParams?: {
        [index: string]: string;
    } | null, strict?: boolean): string;
    addQueryParamsToUrl(route: ActivatedRouteSnapshot, params?: {
        [index: string]: any;
    }): string;
    getPermission(eNums: any[]): boolean;
    private _replaceParams;
    private _removeParams;
    private _getRouteByENum;
    private _getUrl;
    private _getByENum;
    private _formatQueryParams;
}
export declare const BydRoutes: BydRoutesCore;
