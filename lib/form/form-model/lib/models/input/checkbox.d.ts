import { IInputBase, InputBase } from './base';
export interface IInputCheckBox extends IInputBase<boolean> {
    toggle?: boolean;
}
export declare class InputCheckBox extends InputBase<boolean> {
    controlType: string;
    constructor(options?: IInputCheckBox);
}
