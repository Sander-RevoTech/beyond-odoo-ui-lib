import { Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ErrorStateMatcher } from '@angular/material/core';
import { InputChoices } from '@beyond/form-model';
import { BydAbstractComponent } from '@beyond/utils';
import * as i0 from "@angular/core";
export declare class BydInputChoicesComponent extends BydAbstractComponent {
    private _bottomSheet;
    input: InputChoices;
    matcher: ErrorStateMatcher;
    validators: typeof Validators;
    option: {
        id: string;
        name: string;
    } | null;
    constructor(_bottomSheet: MatBottomSheet);
    openBottomSheet(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydInputChoicesComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BydInputChoicesComponent, "byd-input-choices", never, { "input": { "alias": "input"; "required": false; }; "matcher": { "alias": "matcher"; "required": false; }; }, {}, never, never, true, never>;
}
