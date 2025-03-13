import { Validators } from '@angular/forms';

import { IInputTextBox, InputTextBox } from './textbox';

export class InputEmail extends InputTextBox {
  constructor(options: IInputTextBox<string> = {}) {
    super(options);
    this.type = 'email';
    this.validators.push(Validators.email);
  }
}
