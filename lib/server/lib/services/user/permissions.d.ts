import { Observable } from 'rxjs';
export declare class PermissionsCore {
    private _updated$;
    token: string | null;
    guards: {
        [index: string]: string[];
    };
    roles: string[];
    isAuthenticated: boolean;
    updated$: Observable<number | null>;
    get received(): boolean;
    constructor();
    set(permissions: {
        permission_name: string;
    }[], roles: string[], isAuthenticated: boolean): void;
    setAuthenticated(isAuthenticated: boolean): void;
    hasRole(role: string): boolean;
    canDirectAccess(feature: string, level: string | 'authenticated'): boolean;
    canAccess(feature: string, level: string | 'authenticated'): Observable<boolean>;
}
export declare const Permissions: PermissionsCore;
