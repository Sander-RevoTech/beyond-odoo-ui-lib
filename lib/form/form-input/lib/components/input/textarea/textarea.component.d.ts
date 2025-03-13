import { Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { InputTextarea } from '@beyond/form-model';
import * as i0 from "@angular/core";
export declare class TextareaComponent {
    input: InputTextarea;
    matcher: ErrorStateMatcher;
    validators: typeof Validators;
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<TextareaComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TextareaComponent, "byd-input-textarea", never, { "input": { "alias": "input"; "required": false; }; "matcher": { "alias": "matcher"; "required": false; }; }, {}, never, never, true, never>;
}
