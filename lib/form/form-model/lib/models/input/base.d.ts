import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { SubscriberHandler } from '@beyond/utils';
import { InputLabel } from './label';
export interface IInputsError {
    status: any;
    message: string;
}
export interface IInputBase<T> {
    value$?: Observable<T>;
    value?: T;
    key?: string;
    label?: string;
    type?: string;
    message?: string;
    controlType?: string;
    validators?: ValidatorFn[];
    class?: string;
    children?: (InputBase<any> | InputLabel)[];
    disabled?: boolean;
    readonly?: boolean;
    visible$?: Observable<boolean>;
    bindStatusToVisible?: boolean;
}
export declare class InputBase<T> implements IInputBase<T> {
    key: string;
    label: string;
    type: string;
    message: string;
    controlType: string;
    validators: ValidatorFn[];
    formControl?: AbstractControl;
    class: string;
    children: (InputBase<any> | InputLabel)[];
    disabled: boolean;
    readonly: boolean;
    visible$: Observable<boolean>;
    changeValue$: Subject<T>;
    private _value;
    private _isVisible;
    protected _subscriberHandler: SubscriberHandler;
    get value(): T;
    set value(value: T);
    constructor(options?: IInputBase<any>);
    createFormControl(group?: FormGroup): void;
    launchChangeValue(): void;
    disable(): void;
    enable(): void;
    destroy(): void;
}
