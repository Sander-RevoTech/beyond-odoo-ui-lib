import { IInputBase, InputBase } from './base';
export interface IInputSlider extends IInputBase<number> {
    min?: number;
    max?: number;
}
export declare class InputSlider extends InputBase<number> {
    min: number;
    max: number;
    controlType: string;
    constructor(options?: IInputSlider);
}
