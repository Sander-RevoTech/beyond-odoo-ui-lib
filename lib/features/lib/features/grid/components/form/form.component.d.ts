import { BydAbstractGridComponent } from '../abstract.component';
import { InputBase } from '@beyond/form-model';
import * as i0 from "@angular/core";
export declare class BydGridFormComponent extends BydAbstractGridComponent<unknown> {
    filtersForm: import("@angular/core").WritableSignal<InputBase<any>[]>;
    private _formService;
    ngOnInit(): void;
    apply(data: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydGridFormComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BydGridFormComponent, "byd-grid-form", never, {}, {}, never, never, true, never>;
}
