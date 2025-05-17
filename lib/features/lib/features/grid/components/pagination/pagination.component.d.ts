import { BydAbstractGridComponent } from '../abstract.component';
import * as i0 from "@angular/core";
type PageNumber = {
    number: number;
    icon?: string;
};
export declare class PaginationComponent extends BydAbstractGridComponent<any> {
    readonly PageNumber: {
        pagenumber: PageNumber;
    };
    readonly maxPageNumber = 10;
    get grid(): import("../../models/grid-data").BydGridData<any>;
    get show(): boolean;
    get paginationGetTotalPages(): number;
    constructor();
    getListPage(): PageNumber[];
    private _computedPageNumbers;
    static ɵfac: i0.ɵɵFactoryDeclaration<PaginationComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PaginationComponent, "byd-grid-pagination", never, {}, {}, never, never, true, never>;
}
export {};
