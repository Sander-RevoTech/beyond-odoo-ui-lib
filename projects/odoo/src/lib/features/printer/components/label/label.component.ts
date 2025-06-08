import { AsyncPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import { BydFormComponent } from '@beyond/form-basic';
import { InputBase } from '@beyond/form-model';
import { BydNotificationService, ENotificationCode } from '@beyond/notification';
import { BydTitleComponent, ErrorComponent, LoaderComponent } from '@beyond/ui';
import { BydBaseComponent } from '@beyond/utils';
import { Observable, of } from 'rxjs';

import { PrintDirectWizard } from '../../services/dto/print_direct_wizard';
import { BydPrinterFormService } from '../../services/form.service';
import { BydPrinterService } from '../../services/printer.service';

export interface LabelModalData {
  id: number;
  model: string;
}
@Component({
  selector: '',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss'],
  standalone: true,
  imports: [LoaderComponent, ErrorComponent, BydTitleComponent, BydFormComponent, MatIcon, AsyncPipe],
})
export class LabelModal extends BydBaseComponent {
  private readonly _notificationService = inject(BydNotificationService);
  private readonly _printerService = inject(BydPrinterService);
  private readonly _printerFormService = inject(BydPrinterFormService);

  public form: InputBase<any>[] = [];

  public wizard = signal<Observable<PrintDirectWizard | null>>(of(null));

  constructor(
    public dialogRef: MatDialogRef<LabelModal>,
    @Inject(MAT_DIALOG_DATA) public data: LabelModalData
  ) {
    super();
    this.wizard.set(this._printerService.printWizard.get$(this.data.id));

    this._fetch();
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

  private _fetch() {
    this.requestState.asked();
    this._printerService.printWizard$(this.data).subscribe(wizard => {
      this.form = this._printerFormService.getForm(wizard);
      this.requestState.completed();
    });
  }
}
