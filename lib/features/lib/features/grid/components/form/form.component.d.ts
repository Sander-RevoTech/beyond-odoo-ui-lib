import { InputBase } from '@beyond/form-model';
import { BydAbstractGridComponent } from '../abstract.component';
import * as i0 from "@angular/core";
export declare class BydGridFormComponent extends BydAbstractGridComponent<unknown> {
    filtersForm: import("@angular/core").WritableSignal<InputBase<any>[]>;
    groupForm: import("@angular/core").WritableSignal<InputBase<any>[]>;
    private _formService;
    ngOnInit(): void;
    applyFilters(data: any): void;
    applyGroup(data: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydGridFormComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BydGridFormComponent, "byd-grid-form", never, {}, {}, never, never, true, never>;
}
