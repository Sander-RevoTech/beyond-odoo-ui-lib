import { Observable } from 'rxjs';
import { IInputBase, InputBase } from './base';
export interface IInputRadio<T> extends IInputBase<T> {
    options?: Observable<{
        id: T;
        name?: string;
        icon?: string;
    }[]>;
    useMaterialTheme?: boolean;
}
export declare class InputRadio<T> extends InputBase<T> {
    controlType: string;
    useMaterialTheme: boolean;
    options: Observable<{
        id: T;
        name?: string;
        icon?: string;
    }[]>;
    constructor(options?: IInputRadio<T>);
}
