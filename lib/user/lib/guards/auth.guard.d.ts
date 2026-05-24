import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class AuthGuard {
    private readonly _permissionsServices;
    private _router;
    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean;
    setRedirect(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AuthGuard, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AuthGuard>;
}
