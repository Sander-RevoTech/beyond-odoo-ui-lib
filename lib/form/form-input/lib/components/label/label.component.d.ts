import { ValidatorFn, Validators } from '@angular/forms';
import * as i0 from "@angular/core";
export declare class FormLabelComponent {
    input: {
        label: string;
        validators: ValidatorFn[];
    };
    readonly validators: typeof Validators;
    static ɵfac: i0.ɵɵFactoryDeclaration<FormLabelComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<FormLabelComponent, "byd-form-label", never, { "input": { "alias": "input"; "required": false; }; }, {}, never, never, true, never>;
}
