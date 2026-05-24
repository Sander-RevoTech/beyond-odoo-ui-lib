import { HandleSimpleRequest } from '@beyond/server';
import { BydBaseOdooService } from '../baseService';
import { Workcenter } from './dto/workcenter';
import * as i0 from "@angular/core";
export declare class BydWorkcentersService extends BydBaseOdooService {
    workcenters: HandleSimpleRequest<Workcenter[]>;
    workcenter: HandleSimpleRequest<Workcenter>;
    constructor();
    fetch$(ids: number[], warehouseId: number): import("rxjs").Observable<Workcenter[]>;
    get$(id: number): import("rxjs").Observable<Workcenter>;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydWorkcentersService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<BydWorkcentersService>;
}
