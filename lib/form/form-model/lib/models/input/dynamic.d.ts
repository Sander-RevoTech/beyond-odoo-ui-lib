import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { FactoryInputType } from '../factory';
import { IInputBase, InputBase } from './base';
interface IInputTemplateDynamic {
    type: FactoryInputType;
    options: IInputChildrenDynamic;
}
export interface IInputChildrenDynamic extends IInputBase<any> {
    templateChildren?: () => InputBase<any>[];
}
export interface IInputDynamic extends IInputBase<any> {
    inputsGroup?: {
        [key: string]: InputBase<any>[];
    };
    template?: IInputTemplateDynamic[];
}
export declare class InputDynamic extends InputBase<{
    [index: string]: any;
}> {
    listChanged$: Subject<void>;
    inputsGroup: {
        [key: string]: InputBase<any>[];
    };
    template: IInputTemplateDynamic[];
    firstRender: boolean;
    composedKeyForGroup: boolean;
    formControl?: FormGroup;
    constructor(options?: IInputDynamic);
    add(key?: string): void;
    remove(id: string): void;
    createFormControl(group: FormGroup): void;
    private _addControl;
    private _inputKey;
}
export {};
