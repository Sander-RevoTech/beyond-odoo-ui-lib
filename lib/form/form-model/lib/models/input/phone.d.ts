import { InputBase } from './base';
import { IInputTextBox } from './textbox';
export declare class InputPhone extends InputBase<string> {
    controlType: string;
    preferredCountries: string[];
    constructor(options?: IInputTextBox<string>);
}
