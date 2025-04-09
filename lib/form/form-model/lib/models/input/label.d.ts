import { Observable } from 'rxjs';
import { IInputBase, InputBase } from './base';
export interface IInputLabel extends IInputBase<unknown> {
    extraInfo?: Observable<string>;
}
export declare class InputLabel extends InputBase<unknown> implements IInputLabel {
    extraInfo: Observable<string>;
    constructor(options?: IInputLabel);
}
