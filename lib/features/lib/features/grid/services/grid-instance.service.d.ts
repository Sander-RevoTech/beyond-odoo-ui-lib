import { BydGridData } from '../models/grid-data';
import * as i0 from "@angular/core";
export declare class BydGridInstanceService<T> {
    readonly grids: {
        [index: string]: BydGridData<T>;
    };
    constructor();
    create(key: string): void;
    get(key: string, create?: boolean): BydGridData<T>;
    has(key: string): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydGridInstanceService<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<BydGridInstanceService<any>>;
}
