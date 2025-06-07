import { BydBaseOdooService } from '../baseService';
import { Employee } from './dto/employee';
import * as i0 from "@angular/core";
export declare class BydEmployeeService extends BydBaseOdooService {
    constructor();
    searchByName$(name: string): import("rxjs").Observable<Employee[]>;
    getWarehouses$(id: number): import("rxjs").Observable<number[]>;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydEmployeeService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<BydEmployeeService>;
}
