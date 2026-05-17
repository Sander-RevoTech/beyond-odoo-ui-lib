import { AsyncPipe, NgFor, NgTemplateOutlet } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { InputChoices, InputChoicesOption } from '@beyond/form-model';
import { BydBadgeComponent, CardComponent, CardContentComponent } from '@beyond/ui';
import { Subject, debounceTime, mergeMap } from 'rxjs';

export interface ChoicesBottomSheetComponentData {
  input: InputChoices;
}
export interface ChoicesBottomSheetComponentResult {
  id: string;
  name: string;
}

@Component({
  selector: '',
  templateUrl: './bottom.component.html',
  styleUrls: ['./bottom.component.scss'],
  standalone: true,
  imports: [CardComponent, CardContentComponent, AsyncPipe, NgFor, NgTemplateOutlet, MatFormFieldModule, MatInputModule, MatIconModule],
})
export class ChoicesBottomSheetComponent extends BydBadgeComponent {
  readonly searchValue = new Subject<string>();

  readonly options = new Subject<InputChoicesOption[]>();

  public currentSearch = '';

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<ChoicesBottomSheetComponent, ChoicesBottomSheetComponentResult>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: ChoicesBottomSheetComponentData
  ) {
    super();
    if (this.data.input.advancedSearch$) {
      this.searchValue
        .pipe(
          debounceTime(1000),
          mergeMap(value => this.data.input.advancedSearch$!(value))
        )
        .subscribe(result => {
          this.options.next(result);
        });
    }
    this.searchValuechanged('');
  }

  public choice(data: { id: string; name: string }) {
    this._bottomSheetRef.dismiss(data);
  }

  public isSelected = (option: { id: string }): boolean => {
    const value = this.data.input.value;
    return value === option.id;
  };

  public searchValuechanged(value: string) {
    this.currentSearch = value;
    this.searchValue.next(value);
  }
}
