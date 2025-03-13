import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { InputTextarea } from '@beyond/form-model';
import { FormLabelComponent } from '../../label/label.component';

@Component({
  selector: 'byd-input-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
    standalone: true,
    imports: [MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, FormLabelComponent],

})
export class TextareaComponent {
  @Input()
  input!: InputTextarea;

  @Input()
  matcher!: ErrorStateMatcher;

  public validators = Validators;

  constructor() {}

}
