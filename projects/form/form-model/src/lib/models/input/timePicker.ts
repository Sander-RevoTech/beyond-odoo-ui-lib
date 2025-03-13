import { IInputTextBox, InputTextBox } from './textbox';

export interface IInputTimePicker extends IInputTextBox<string> {}

export class InputTimePicker extends InputTextBox {
  constructor(options: IInputTimePicker = {}) {
    super(options);
    this.type = 'time';
    this.controlType = 'timePicker';
  }
}
