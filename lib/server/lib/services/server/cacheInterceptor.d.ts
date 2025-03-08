import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class CacheInterceptor implements HttpInterceptor {
    private cache;
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
    static ɵfac: i0.ɵɵFactoryDeclaration<CacheInterceptor, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CacheInterceptor>;
}
