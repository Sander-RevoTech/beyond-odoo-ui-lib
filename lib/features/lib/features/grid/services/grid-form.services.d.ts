import { BydGridData } from '../models/grid-data';
import { InputBase } from '@beyond/form-model';
import { Filter } from '../models/types';
import * as i0 from "@angular/core";
export declare class BydGridFormService<T> {
    constructor();
    getFiltersForm(model: BydGridData<T>): InputBase<any>[];
    formatFiltersForm(model: BydGridData<T>, data: any): Filter[];
    static ɵfac: i0.ɵɵFactoryDeclaration<BydGridFormService<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<BydGridFormService<any>>;
}
