import { BydBaseOdooService } from '@beyond/odoo';
import { BydPermissionsServices, HandleSimpleRequest } from '@beyond/server';
import { Profile } from './dto/profile';
import * as i0 from "@angular/core";
export declare class BydUserService extends BydBaseOdooService {
    readonly profile$: HandleSimpleRequest<Profile>;
    readonly permissionsServices: BydPermissionsServices;
    constructor();
    fetchProfile$(): import("rxjs").Observable<null> | import("rxjs").Observable<Profile>;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydUserService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<BydUserService>;
}
