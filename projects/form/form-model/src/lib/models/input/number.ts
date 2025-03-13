import { IInputTextBox, InputTextBox } from './textbox';

export class InputNumber extends InputTextBox {
  constructor(options: IInputTextBox<string> = {}) {
    super(options);
    this.type = 'number';
  }
}
