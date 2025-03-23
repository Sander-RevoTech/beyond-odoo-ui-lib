import { Component, Input } from '@angular/core';

import { InputButton } from 'src/app/models/form/input/extra/button';

@Component({
  selector: 'app-input-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class InputButtonComponent {
  @Input()
  input!: InputButton;
}
