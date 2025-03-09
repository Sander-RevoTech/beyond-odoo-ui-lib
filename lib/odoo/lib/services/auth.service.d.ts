import { BydPermissionsServices } from '@beyond/server';
import { BydBaseOdooService } from './baseService';
import * as i0 from "@angular/core";
export declare class BydAuthOdooService extends BydBaseOdooService {
    readonly permissionsServices: BydPermissionsServices;
    constructor();
    login(data: {
        identifier: string;
        password: string;
    }): import("rxjs").Subject<unknown>;
    logout(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydAuthOdooService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<BydAuthOdooService>;
}
