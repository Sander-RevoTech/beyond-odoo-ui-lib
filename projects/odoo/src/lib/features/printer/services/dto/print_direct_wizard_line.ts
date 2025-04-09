import { ManyToOneType } from "../../../../types/types";

export interface PrintDirectWizardLine {
  id: number;
  display_name: string;
  print_qty: number;

  printer_id: ManyToOneType;
}

export interface PrintDirectWizardLinePost {
  id: number;
  print_qty: number;
  printer_id: number;
}
