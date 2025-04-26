import { Component, Inject } from '@angular/core';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InputChoices, InputChoicesOption } from '@beyond/form-model';
import { CardComponent, CardContentComponent } from '@beyond/ui';
import { Subject } from 'rxjs';


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
  imports: [MatFormFieldModule, FormsModule, CardComponent, CardContentComponent],
})
export class ChoicesBottomSheetComponent {
  public searchValue: string = '';

  readonly options = new Subject<InputChoicesOption[]>();
  constructor(
    private _bottomSheetRef: MatBottomSheetRef<ChoicesBottomSheetComponent, ChoicesBottomSheetComponentResult>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: ChoicesBottomSheetComponentData
  ) {
    this.searchValuechanged('');
  }

  public choice(data: { id: string; name: string }) {
    this._bottomSheetRef.dismiss(data);
  }

  public searchValuechanged(value: string) {
    if(!this.data.input.advancedSearch$) {
      return;
    }
    this.data.input.advancedSearch$(value).subscribe((result) => {
      this.options.next(result);
    });
  }
}
