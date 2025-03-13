import { IInputBase, InputBase } from './base';
export interface IInputTextarea<T> extends IInputBase<T> {
}
export declare class InputTextarea extends InputBase<string> {
    controlType: string;
    constructor(options?: IInputTextarea<string>);
}
