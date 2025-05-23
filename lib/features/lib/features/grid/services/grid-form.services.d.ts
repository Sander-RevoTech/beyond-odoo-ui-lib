import { InputBase } from '@beyond/form-model';
import { BydGridData } from '../models/grid-data';
import { Filter } from '../models/types';
import * as i0 from "@angular/core";
export declare class BydGridFormService<T> {
    constructor();
    getFiltersForm(model: BydGridData<T>): InputBase<any>[];
    formatFiltersForm(model: BydGridData<T>, data: any): Filter[];
    getGroupForm(model: BydGridData<T>): InputBase<any>[];
    formatGroupForm(data: any): string | null;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydGridFormService<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<BydGridFormService<any>>;
}
