import { Observable } from 'rxjs';
import { IInputBase, InputBase } from './base';
export interface IInputDropdown<T> extends IInputBase<T> {
    options?: Observable<{
        id: string;
        name: string;
    }[]>;
    multiple?: boolean;
    showNothingOption?: boolean;
    withSearch?: boolean;
    width?: string;
    valueChanged?: (data?: string) => void;
}
export declare class InputDropdown<T = string | string[]> extends InputBase<T> {
    controlType: string;
    options: Observable<{
        id: string;
        name: string;
        disabled?: boolean;
    }[]>;
    multiple: boolean;
    showNothingOption: boolean;
    withSearch: boolean;
    width?: string;
    constructor(options?: IInputDropdown<T>);
}
