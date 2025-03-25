import { IInputDropdown, InputDropdown } from './dropdown';
export interface IInputChoices<T> extends IInputDropdown<T> {
}
export declare class InputChoices<T = string | string[]> extends InputDropdown<T> {
    controlType: string;
    constructor(options?: IInputChoices<T>);
}
