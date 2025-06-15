import { HandleSimpleRequest } from '@beyond/server';
import { BydBaseOdooService } from '../baseService';
import { Company } from './dto/company';
import * as i0 from "@angular/core";
export declare class BydCompaniesService extends BydBaseOdooService {
    companies: HandleSimpleRequest<Company[]>;
    company: HandleSimpleRequest<Company>;
    constructor();
    fetch$(ids: number[]): import("rxjs").Observable<Company[]>;
    get$(id: number): import("rxjs").Observable<Company>;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydCompaniesService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<BydCompaniesService>;
}
