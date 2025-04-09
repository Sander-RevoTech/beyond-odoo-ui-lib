import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { LabelModal, LabelModalData } from '../label/label.component';
import { BydBaseComponent } from '@beyond/utils';
import { BydPrinterService } from '../../services/printer.service';

@Component({
  selector: 'byd-printer-container',
  template: '',
})
export class ContainerComponent extends BydBaseComponent {
  private readonly _printerService = inject(BydPrinterService)

  constructor(private _dialog: MatDialog) {
    super();
    this._registerSubscription(
      this._printerService.askPrintingWizard$.subscribe(data => {
        this._printerService.printWizard$(data).subscribe();
        this._dialog.open<LabelModal, LabelModalData>(LabelModal, {
          data,
        });
      })
    );
  }
}
