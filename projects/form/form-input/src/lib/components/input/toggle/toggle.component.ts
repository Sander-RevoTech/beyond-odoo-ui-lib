import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { InputCheckBox } from '@beyond/form-model';
import { TranslatePipe } from '@beyond/translation';
import { BydBaseComponent } from '@beyond/utils';

@Component({
  selector: 'byd-input-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    TranslatePipe,
    MatSlideToggleModule,
  ],
})
export class ToggleComponent extends BydBaseComponent {
  @Input()
  input!: InputCheckBox;

  constructor() {
    super();
  }
}
