import { Component, Input, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { BydBaseComponent } from '@beyond/utils';

import { BydScanPackingService } from '../services/scan-packing.service';
import { ScanPackingDialog, ScanPackingDialogData, Scope } from './scan-packing-modal/scan-packing-modal.component';

@Component({
  selector: 'byd-scan-packing',
  template: '',
})
export class BydScanPackingComponent extends BydBaseComponent {
  @Input()
  scopes!: Scope[];

  private readonly _scanPacking = inject(BydScanPackingService);
  constructor(private _dialog: MatDialog) {
    super();

    this._registerSubscription(this._scanPacking.askScanning.subscribe(this.openScan));
  }

  public openScan = () => {
    this._dialog.open<ScanPackingDialog, ScanPackingDialogData>(ScanPackingDialog, {
      data: {
        scopes: this.scopes,
      },
    });
  };
}
