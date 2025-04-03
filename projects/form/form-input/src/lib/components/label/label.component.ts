import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { TranslatePipe } from '@beyond/translation';

@Component({
  selector: 'byd-form-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, TranslatePipe],
})
export class FormLabelComponent {
  @Input()
  input!: { label: string; validators: ValidatorFn[] };

  public readonly validators = Validators;
}
