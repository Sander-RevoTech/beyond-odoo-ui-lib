import { AsyncPipe, NgFor } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InputChoices, InputChoicesOption } from '@beyond/form-model';
import { BydBadgeComponent, CardComponent, CardContentComponent } from '@beyond/ui';
import { debounceTime, mergeMap, Subject } from 'rxjs';


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
  imports: [CardComponent, CardContentComponent, AsyncPipe, NgFor],
})
export class ChoicesBottomSheetComponent extends BydBadgeComponent{
  readonly searchValue = new Subject<string>();

  readonly options = new Subject<InputChoicesOption[]>();

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<ChoicesBottomSheetComponent, ChoicesBottomSheetComponentResult>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: ChoicesBottomSheetComponentData
  ) {
    super();
    if(this.data.input.advancedSearch$) {
      this.searchValue.pipe(debounceTime(1000), mergeMap((value) => this.data.input.advancedSearch$!(value))).subscribe((result) => {
        this.options.next(result);
      });
    }
    this.searchValuechanged('');
  }

  public choice(data: { id: string; name: string }) {
    this._bottomSheetRef.dismiss(data);
  }

  public searchValuechanged(value: string) {
    this.searchValue.next(value);
  }
}
