import { InputTextBox } from '@beyond/form-model';
import { BydAbstractGridComponent } from '../abstract.component';
import * as i0 from "@angular/core";
export declare class BydGridSearchComponent extends BydAbstractGridComponent<any> {
    outOfBox: boolean;
    input: InputTextBox<string>;
    private _session;
    constructor();
    valueChanged(value: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydGridSearchComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BydGridSearchComponent, "byd-grid-search", never, { "outOfBox": { "alias": "outOfBox"; "required": false; }; }, {}, never, never, true, never>;
}
