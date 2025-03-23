import { IInputBase, InputBase } from './base';
import { Observable } from 'rxjs';
export interface IInputLabel extends IInputBase<null> {
    extraInfo?: Observable<string>;
}
export declare class InputLabel extends InputBase<null> implements IInputLabel {
    extraInfo: Observable<string>;
    constructor(options?: IInputLabel);
}
