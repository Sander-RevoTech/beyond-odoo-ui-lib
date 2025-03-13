import { FormGroup } from '@angular/forms';
import { IInputBase, InputBase } from './base';
export interface IInputLabel extends IInputBase<null> {
}
export declare class InputLabel extends InputBase<null> implements IInputLabel {
    constructor(options?: IInputLabel);
    createFormControl(group?: FormGroup): void;
}
