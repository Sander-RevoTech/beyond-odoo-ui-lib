import { MatDialogRef } from '@angular/material/dialog';
import { InputBase } from '@beyond/form-model';
import { BydBaseComponent } from '@beyond/utils';
import { PrintDirectWizard } from '../../services/dto/print_direct_wizard';
import * as i0 from "@angular/core";
export interface LabelModalData {
    id: number;
    model: string;
}
export declare class LabelModal extends BydBaseComponent {
    dialogRef: MatDialogRef<LabelModal>;
    data: LabelModalData;
    private readonly _notificationService;
    private readonly _printerService;
    private readonly _printerFormService;
    form: InputBase<any>[];
    wizard: PrintDirectWizard | null;
    get displayName(): string;
    constructor(dialogRef: MatDialogRef<LabelModal>, data: LabelModalData);
    print(values: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<LabelModal, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<LabelModal, "ng-component", never, {}, {}, never, never, true, never>;
}
