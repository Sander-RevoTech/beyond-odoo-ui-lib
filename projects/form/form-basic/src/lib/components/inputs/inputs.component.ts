import { NgSwitch, NgSwitchCase, NgTemplateOutlet } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

import {
  CheckboxComponent,
  DropdownComponent,
  LabelComponent,
  RadioComponent,
  TextBoxComponent,
  TextareaComponent,
  ToggleComponent,
} from '@beyond/form-input';
import { InputBase } from '@beyond/form-model';
import { BydBaseComponent } from '@beyond/utils';

import { PanelComponent } from '../input/panel/panel.component';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'byd-inputs',
  templateUrl: './inputs.component.html',
  styleUrls: ['./inputs.component.scss'],
  standalone: true,
  imports: [
    NgTemplateOutlet,
    NgSwitch,
    NgSwitchCase,
    TextBoxComponent,
    TextareaComponent,
    DropdownComponent,
    RadioComponent,
    CheckboxComponent,
    ToggleComponent,
    PanelComponent,
    LabelComponent,
  ],
})
export class InputsComponent extends BydBaseComponent {
  @Input()
  input!: InputBase<any>;

  @Input()
  space = true;

  matcher = new MyErrorStateMatcher();
}
