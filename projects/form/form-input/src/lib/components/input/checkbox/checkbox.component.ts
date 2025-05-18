import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { InputCheckBox } from '@beyond/form-model';
import { TranslatePipe } from '@beyond/translation';
import { BydBaseComponent } from '@beyond/utils';

@Component({
  selector: 'byd-input-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, TranslatePipe, MatCheckbox],
})
export class CheckboxComponent extends BydBaseComponent {
  @Input()
  input!: InputCheckBox;

  constructor() {
    super();
  }
}
