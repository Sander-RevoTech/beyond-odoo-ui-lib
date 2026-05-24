import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { InputChoices } from '@beyond/form-model';
import { TranslatePipe } from '@beyond/translation';
import { BydAbstractComponent } from '@beyond/utils';
import { take } from 'rxjs';

import {
  ChoicesBottomSheetComponent,
  ChoicesBottomSheetComponentData,
  ChoicesBottomSheetComponentResult,
} from './bottom/bottom.component';

@Component({
  selector: 'byd-input-choices',
  templateUrl: './choices.component.html',
  styleUrls: ['./choices.component.scss'],
  standalone: true,
  imports: [MatFormField, MatLabel, MatHint, MatError, TranslatePipe, MatInputModule, NgFor, NgIf],
})
export class BydInputChoicesComponent extends BydAbstractComponent implements OnInit {
  @Input()
  input!: InputChoices;

  @Input()
  matcher!: ErrorStateMatcher;

  public validators = Validators;

  public option: { id: string; name: string } | null = null;

  constructor(private _bottomSheet: MatBottomSheet) {
    super();
  }

  ngOnInit() {
    if (!this.input.value) return;

    const source$ = this.input.advancedSearch$ ? this.input.advancedSearch$(undefined) : this.input.options;
    if (!source$) return;

    this._registerSubscription(
      source$.pipe(take(1)).subscribe(options => {
        const match = options.find(opt => opt.id === this.input.value?.toString());
        if (match) this.option = match;
      })
    );
  }

  public openBottomSheet() {
    if (this.input.readonly) {
      return;
    }
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
