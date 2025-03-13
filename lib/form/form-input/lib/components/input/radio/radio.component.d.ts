import { InputRadio } from '@beyond/form-model';
import { BydSizes } from '@beyond/styles';
import { BydBaseComponent } from '@beyond/utils';
import * as i0 from "@angular/core";
export declare class RadioComponent extends BydBaseComponent {
    input: InputRadio<any>;
    constructor();
    iconSize(option: {
        name?: string;
    }): BydSizes;
    hasLabel(option: {
        name?: string;
    }): boolean;
    onOptionClicked(optionId: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<RadioComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<RadioComponent, "byd-input-radio", never, { "input": { "alias": "input"; "required": false; }; }, {}, never, never, true, never>;
}
