import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class FeatureGuard {
    private router;
    private readonly _permissionsServices;
    constructor(router: Router);
    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean;
    setRedirect(): void;
    private _isValidPermission;
    static ɵfac: i0.ɵɵFactoryDeclaration<FeatureGuard, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<FeatureGuard>;
}
