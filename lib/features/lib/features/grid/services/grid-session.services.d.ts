import { Filter } from '../models/types';
import * as i0 from "@angular/core";
export declare class BydGridSessionService {
    private _filterData;
    setFilter(key: string, filter: Filter[]): void;
    getFilter(key: string): import("tabulator-tables").Filter[] | null;
    clearFilter(key: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydGridSessionService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<BydGridSessionService>;
}
