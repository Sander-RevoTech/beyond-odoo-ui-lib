import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { BydBaseOdooService } from '../../../services/baseService';
import { PrintDirectWizard } from './dto/print_direct_wizard';
import { PrintDirectWizardLine, PrintDirectWizardLinePost } from './dto/print_direct_wizard_line';
import { Printer } from './dto/printer';
import * as i0 from "@angular/core";
export declare class BydPrinterService extends BydBaseOdooService {
    askPrintingWizard$: Subject<{
        id: number;
        model: string;
    }>;
    printers$: BehaviorSubject<Printer[]>;
    private _printWizard$;
    constructor();
    getPrintWizard$(id: number): Observable<PrintDirectWizard>;
    printWizard$(data: {
        id: number;
        model: string;
    }): Observable<{
        lines: PrintDirectWizardLine[];
        id: number;
        display_name: string;
        print_lines: number[];
    }>;
    fetchPrinters$(): Observable<Printer[]>;
    print$(lines: PrintDirectWizardLinePost[]): Observable<unknown[]>;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydPrinterService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<BydPrinterService>;
}
