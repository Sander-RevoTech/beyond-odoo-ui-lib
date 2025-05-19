import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';

import { InputDatePicker } from '@beyond/form-model';
import { BydBaseComponent } from '@beyond/utils';

import { FormLabelComponent } from '../../label/label.component';

@Component({
  selector: 'byd-input-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  standalone: true,
  imports: [
    BrowserModule,
    MatFormFieldModule,
    MatInputModule,
    FormLabelComponent,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class BydDatePickerComponent extends BydBaseComponent {
  @Input()
  input!: InputDatePicker;

  constructor() {
    super();
  }
}
