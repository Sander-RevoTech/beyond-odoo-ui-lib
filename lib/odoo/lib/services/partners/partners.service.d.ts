import { BehaviorSubject } from 'rxjs';
import { BydBaseOdooService } from '../baseService';
import { Partners } from './dto/partners';
import * as i0 from "@angular/core";
export declare class BydPartnersService extends BydBaseOdooService {
    partners$: BehaviorSubject<Partners[]>;
    constructor();
    fetchList(value: string): import("rxjs").Observable<Partners[]>;
    fetchListById(id: string): import("rxjs").Observable<Partners[]>;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydPartnersService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<BydPartnersService>;
}
