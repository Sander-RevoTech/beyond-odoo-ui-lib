import { EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BydBaseComponent } from '@beyond/utils';
import { TranslationData } from '../common-dialog';
import * as i0 from "@angular/core";
export declare class BydContainerValidationComponent extends BydBaseComponent {
    dialog: MatDialog;
    disabled: boolean;
    translation: TranslationData;
    validated: EventEmitter<any>;
    constructor(dialog: MatDialog);
    openDialog(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydContainerValidationComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BydContainerValidationComponent, "byd-container-validation", never, { "disabled": { "alias": "disabled"; "required": false; }; "translation": { "alias": "translation"; "required": false; }; }, { "validated": "validated"; }, never, ["*"], true, never>;
}
