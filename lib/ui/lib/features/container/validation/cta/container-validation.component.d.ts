import { EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslationData } from '../common-dialog';
import { BydBaseComponent } from '@beyond/utils';
import * as i0 from "@angular/core";
export declare class ContainerValidationComponent extends BydBaseComponent {
    dialog: MatDialog;
    disabled: boolean;
    translation: TranslationData;
    validated: EventEmitter<any>;
    constructor(dialog: MatDialog);
    openDialog(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ContainerValidationComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ContainerValidationComponent, "app-container-validation", never, { "disabled": { "alias": "disabled"; "required": false; }; "translation": { "alias": "translation"; "required": false; }; }, { "validated": "validated"; }, never, ["*"], true, never>;
}
