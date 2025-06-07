import { HandleSimpleRequest } from '@beyond/server';
import { BydBaseOdooService } from '../baseService';
import { Warehouse } from './dto/warehouse';
import * as i0 from "@angular/core";
export declare class BydWarehousesService extends BydBaseOdooService {
    warehouses: HandleSimpleRequest<Warehouse[]>;
    warehouse: HandleSimpleRequest<Warehouse>;
    constructor();
    fetch$(ids: number[]): import("rxjs").Observable<Warehouse[]>;
    get$(id: number): import("rxjs").Observable<Warehouse>;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydWarehousesService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<BydWarehousesService>;
}
