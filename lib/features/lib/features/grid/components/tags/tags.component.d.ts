import { BydAbstractGridComponent } from '../abstract.component';
import { Filter } from '../../models/types';
import * as i0 from "@angular/core";
export declare class BydGridTagsComponent extends BydAbstractGridComponent<unknown> {
    get activeFilters(): import("@beyond/features").ActiveFilter[];
    ngOnInit(): void;
    remove(filter: Filter): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydGridTagsComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BydGridTagsComponent, "cam-grid-tags", never, {}, {}, never, never, true, never>;
}
