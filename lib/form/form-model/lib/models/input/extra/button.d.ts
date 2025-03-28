import { Observable } from 'rxjs';
import { IInputBase, InputBase } from '../base';
export interface IInputButton extends IInputBase<any> {
    callback?: Function;
    disabled$?: Observable<boolean>;
    style?: 'primary' | 'secondary' | 'danger';
}
export declare class InputButton extends InputBase<any> {
    controlType: string;
    callback: Function;
    disabled$?: Observable<boolean>;
    style: 'primary' | 'secondary' | 'danger';
    constructor(options?: IInputButton);
}
