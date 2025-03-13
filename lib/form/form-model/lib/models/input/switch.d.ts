import { Observable } from 'rxjs';
import { IInputBase, InputBase } from './base';
export interface IFormSwitch extends IInputBase<null> {
    matchtype: Observable<'textbox' | 'checkbox' | 'number' | 'datePicker'>;
}
export declare class InputSwitch extends InputBase<any> {
    contentClass: string;
    matchtype: Observable<string>;
    constructor(options: IFormSwitch);
}
