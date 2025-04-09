import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InputBase } from '@beyond/form-model';
import { BydBaseComponent } from '@beyond/utils';
import { PrintDirectWizard } from '../../services/dto/print_direct_wizard';
import { BydPrinterService } from '../../services/printer.service';
import { BydPrinterFormService } from '../../services/form.service';
import { BydNotificationService, ENotificationCode } from '@beyond/notification';


export interface LabelModalData {
  id: number;
  model: string;
}
@Component({
  selector: '',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss'],
})
export class LabelModal extends BydBaseComponent {
  private readonly _notificationService = inject(BydNotificationService);
  private readonly _printerService = inject(BydPrinterService);
  private readonly _printerFormService = inject(BydPrinterFormService);

  public form: InputBase<any>[] = [];

  public wizard: PrintDirectWizard | null = null;

  get displayName() {
    return this.wizard?.display_name || (this.wizard?.lines || [])[0].display_name || '';
  }
  constructor(
    public dialogRef: MatDialogRef<LabelModal>,
    @Inject(MAT_DIALOG_DATA) public data: LabelModalData
  ) {
    super();
    this.requestState.asked();
    this._printerService.getPrintWizard$(this.data.id).subscribe(wizard => {
      this.form = this._printerFormService.getForm(wizard);
      this.wizard = wizard;
      this.requestState.completed();
    });
  }

  public print(values: any) {
    this.requestState.asked();
    const lines = this._printerFormService.formatForm(values);

    this._printerService.print$(lines).subscribe({
      complete: () => {
        this.requestState.completed();
        this._notificationService.addNotification('Sended to printer', ENotificationCode.success);
        this.dialogRef.close();
      },
      error: (error: HttpErrorResponse) => {
        this.requestState.onError(error.status, error.statusText);
      },
    });
  }
}
