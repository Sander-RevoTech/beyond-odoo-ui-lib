import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export type BydPermissionLevel = string | 'authenticated' | 'unauthenticated';
export declare class BydPermissionsServices {
    private _updated$;
    uid: number | null;
    pass: string | null;
    token: string | null;
    guards: {
        [index: string]: string[];
    };
    roles: string[];
    get isAuthenticated(): boolean;
    updated$: Observable<number | null>;
    private _sep;
    get received(): boolean;
    constructor();
    set(uid: number | null, pass: string): void;
    reset(): void;
    hasRole(role: string): boolean;
    canDirectAccess(feature: string, level: BydPermissionLevel): boolean;
    canAccess(feature: string, level: BydPermissionLevel): Observable<boolean>;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydPermissionsServices, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<BydPermissionsServices>;
}
