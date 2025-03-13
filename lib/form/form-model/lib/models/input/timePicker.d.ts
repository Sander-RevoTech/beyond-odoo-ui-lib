import { IInputTextBox, InputTextBox } from './textbox';
export interface IInputTimePicker extends IInputTextBox<string> {
}
export declare class InputTimePicker extends InputTextBox {
    constructor(options?: IInputTimePicker);
}
