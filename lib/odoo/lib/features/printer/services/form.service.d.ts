import { InputBase } from '@beyond/form-model';
import { PrintDirectWizard } from './dto/print_direct_wizard';
import { PrintDirectWizardLinePost } from './dto/print_direct_wizard_line';
import * as i0 from "@angular/core";
export declare class BydPrinterFormService {
    private readonly _printerService;
    constructor();
    getForm(wizard: PrintDirectWizard): InputBase<any>[];
    formatForm(data: any): PrintDirectWizardLinePost[];
    static ɵfac: i0.ɵɵFactoryDeclaration<BydPrinterFormService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<BydPrinterFormService>;
}
