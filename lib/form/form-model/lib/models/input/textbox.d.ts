import { IInputBase, InputBase } from './base';
export interface IInputTextBox<T> extends IInputBase<T> {
    type?: string;
    icon?: string;
    iconClicked?: () => void;
}
export declare class InputTextBox extends InputBase<string> {
    controlType: string;
    icon?: string | null;
    iconClicked?: () => void;
    constructor(options?: IInputTextBox<string>);
}
