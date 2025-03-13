import { IInputTextBox, InputTextBox } from './textbox';

export class InputColorPicker extends InputTextBox {
  constructor(options: IInputTextBox<string> = {}) {
    super(options);
    this.controlType = 'colorPicker';
  }
}
