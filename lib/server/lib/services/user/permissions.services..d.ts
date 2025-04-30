import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export type BydPermissionLevel = 'all' | 'read' | 'authenticated' | 'unauthenticated';
type Role = 'admin' | 'interne' | 'shared';
export declare class BydPermissionsServices {
    private _updated$;
    uid: number | null;
    pass: string | null;
    token: string | null;
    guards: {
        [index: string]: string[];
    };
    roles: Role[];
    get isAuthenticated(): boolean;
    updated$: Observable<number | null>;
    private _sep;
    get received(): boolean;
    constructor();
    set(uid: number | null, pass: string): void;
    setRoles(role: Role): void;
    reset(): void;
    hasRole(role: Role): boolean;
    canDirectAccess(feature: string, level: BydPermissionLevel): boolean;
    canAccess(feature: string, level: BydPermissionLevel): Observable<boolean>;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydPermissionsServices, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<BydPermissionsServices>;
}
export {};
