import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ScanPackingDialog } from './scan-packing-modal/scan-packing-modal.component';
import { BydScanPackingService } from '../../services/scan/scan-packing.service';
import { BydBaseComponent } from '@beyond/utils';

@Component({
  selector: 'app-scan-packing',
  template: '',
})
export class ScanPackingComponent extends BydBaseComponent {
  private readonly _scanPacking = inject(BydScanPackingService);
  constructor(private _dialog: MatDialog) {
    super();

    this._registerSubscription(this._scanPacking.askScanning.subscribe(this.openScan));
  }

  public openScan = () => {
    this._dialog.open(ScanPackingDialog);
  };
}
