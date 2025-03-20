import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class TargetUrlInterceptor implements HttpInterceptor {
    readonly server: import("@beyond/odoo").IOdooServerConfig;
    constructor();
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
    static ɵfac: i0.ɵɵFactoryDeclaration<TargetUrlInterceptor, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TargetUrlInterceptor>;
}
