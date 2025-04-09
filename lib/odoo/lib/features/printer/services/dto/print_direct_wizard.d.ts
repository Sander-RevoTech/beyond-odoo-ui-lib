import { PrintDirectWizardLine } from './print_direct_wizard_line';
export interface PrintDirectWizard {
    id: number;
    display_name: string;
    print_lines: number[];
    lines?: PrintDirectWizardLine[];
}
