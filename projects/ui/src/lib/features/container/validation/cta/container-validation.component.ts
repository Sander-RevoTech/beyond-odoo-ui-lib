import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';


import { TranslationData, openDialog } from '../common-dialog';
import { BydBaseComponent } from '@beyond/utils';

@Component({
  selector: 'app-container-validation',
  templateUrl: './container-validation.component.html',
  standalone: true,
  imports: []
})
export class ContainerValidationComponent extends BydBaseComponent {
  @Input()
  disabled = false;

  @Input()
  translation: TranslationData = {};

  @Output()
  validated = new EventEmitter();

  constructor(public dialog: MatDialog) {
    super();
  }

  openDialog(): void {
    if (this.disabled) {
      return;
    }

    this._registerSubscription(
      openDialog(this.dialog, this.translation).subscribe(result => {
        if (result?.accepted) {
          this.validated.emit();
        }
      })
    );
  }
}
