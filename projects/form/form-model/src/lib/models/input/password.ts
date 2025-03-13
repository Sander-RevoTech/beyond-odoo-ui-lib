import { Validators } from '@angular/forms';

import { IInputTextBox, InputTextBox } from './textbox';

export class InputPassword extends InputTextBox {
  constructor(options: IInputTextBox<string> = {}) {
    super(options);
    this.type = 'password';
    this.validators.push(Validators.required);
  }
}
