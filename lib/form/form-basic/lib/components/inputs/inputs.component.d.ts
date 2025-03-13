import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { InputBase } from '@beyond/form-model';
import { BydBaseComponent } from '@beyond/utils';
import * as i0 from "@angular/core";
export declare class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean;
}
export declare class InputsComponent extends BydBaseComponent {
    input: InputBase<any>;
    space: boolean;
    matcher: MyErrorStateMatcher;
    static ɵfac: i0.ɵɵFactoryDeclaration<InputsComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<InputsComponent, "byd-inputs", never, { "input": { "alias": "input"; "required": false; }; "space": { "alias": "space"; "required": false; }; }, {}, never, never, true, never>;
}
