import { IInputTextBox, InputTextBox } from './textbox';

export class InputNumber extends InputTextBox<number> {
  constructor(options: IInputTextBox<string> = {}) {
    super(options);
    this.type = 'number';
  }
}
