import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ErrorStateMatcher } from '@angular/material/core';
import {
  ChoicesBottomSheetComponent,
  ChoicesBottomSheetComponentData,
  ChoicesBottomSheetComponentResult,
} from './bottom/bottom.component';
import { BydAbstractComponent } from '@beyond/utils';
import { InputChoices } from '@beyond/form-model';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { TranslatePipe } from '@beyond/translation';
import { MatInputModule } from '@angular/material/input';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-input-choices',
  templateUrl: './choices.component.html',
  styleUrls: ['./choices.component.scss'],
  standalone: true,
  imports: [MatFormField, MatLabel, MatHint, MatError, TranslatePipe, MatInputModule, NgFor, NgIf],
})
export class InputChoicesComponent extends BydAbstractComponent {
  @Input()
  input!: InputChoices;

  @Input()
  matcher!: ErrorStateMatcher;

  public validators = Validators;

  public option: { id: string; name: string } | null = null;

  constructor(private _bottomSheet: MatBottomSheet) {
    super();
  }

  public openBottomSheet() {
    this._registerSubscription(
      this._bottomSheet
        .open<ChoicesBottomSheetComponent, ChoicesBottomSheetComponentData, ChoicesBottomSheetComponentResult>(
          ChoicesBottomSheetComponent,
          {
            data: { input: this.input },
          }
        )
        .afterDismissed()
        .subscribe(data => {
          if (data) {
            this.input.value = data.id;
            this.option = data;
          }
        })
    );
  }
}
