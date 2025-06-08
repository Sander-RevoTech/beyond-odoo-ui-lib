import { HandleComplexRequest, HandleSimpleRequest } from '@beyond/server';
import { Observable, Subject } from 'rxjs';
import { BydBaseOdooService } from '../../../services/baseService';
import { PrintDirectWizard } from './dto/print_direct_wizard';
import { PrintDirectWizardLinePost } from './dto/print_direct_wizard_line';
import { Printer } from './dto/printer';
import * as i0 from "@angular/core";
export declare class BydPrinterService extends BydBaseOdooService {
    askPrintingWizard$: Subject<{
        id: number;
        model: string;
    }>;
    printers: HandleSimpleRequest<Printer[]>;
    printWizard: HandleComplexRequest<PrintDirectWizard>;
    constructor();
    printWizard$(data: {
        id: number;
        model: string;
    }): Observable<PrintDirectWizard>;
    fetchPrinters$(): Observable<Printer[]>;
    print$(lines: PrintDirectWizardLinePost[]): Observable<unknown[]>;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydPrinterService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<BydPrinterService>;
}
