import { AbstractControl, FormControl, FormGroup, ValidatorFn } from '@angular/forms';

// import { ENotificationCode } from '@beyond/notification';
import { SubscriberHandler } from '@beyond/utils';
import { Observable, Subject, Subscription, distinctUntilChanged, of } from 'rxjs';

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

export class InputBase<T> implements IInputBase<T> {
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
  changeValue$ = new Subject<T>();

  private _value: T;
  private _isVisible!: boolean;

  protected _subscriberHandler = new SubscriberHandler();

  get value() {
    return this._value;
  }
  set value(value: T) {
    this._value = value;
    this.formControl?.setValue(value);
  }
  constructor(options: IInputBase<any> = {}) {
    if (options.value$) {
      this._subscriberHandler.registerSubscription(
        options.value$.subscribe({
          next: value => {
            if (this.value) {
              return;
            }
            this.value = value;
          },
        })
      );
    }

    this._value = options.value === undefined ? null : options.value;
    this.key = options.key || Math.random().toString();
    this.label = options.label || '';
    this.type = options.type || '';
    this.message = options.message || '';
    this.controlType = options.controlType || '';
    this.validators = options.validators || [];
    this.class = options.class || 'g-col-12';
    this.children = [];
    this.disabled = options.disabled === true;
    this.readonly = options.readonly === true;

    this.visible$ = options.visible$ || of(true);

    if (options.bindStatusToVisible !== false) {
      this._subscriberHandler.registerSubscription(
        this.visible$.subscribe(visible => {
          this._isVisible = visible;

          if (options.bindStatusToVisible !== false) {
            if (!visible) {
              this.disable();
            } else {
              this.enable();
            }
          }

          if (!visible) {
            this.formControl?.setValue(null);
          }
        })
      );
    }
  }

  public createFormControl(group?: FormGroup) {
    if (this.children.length > 0) {
      for (const child of this.children) {
        if (child instanceof InputBase) {
          child.createFormControl(group);
        }
      }
    } else {
      this.formControl = new FormControl<T>(this.value, this.validators);
      if (this.disabled) {
        this.formControl.disable();
      }
      this._subscriberHandler.registerSubscription(
        this.formControl.valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
          this.value = value;
          this.launchChangeValue();
        })
      );
      if (group) {
        group.addControl(this.key, this.formControl);
      }
    }
  }

  public launchChangeValue() {
    this.changeValue$.next(this.value);
    this.formControl?.updateValueAndValidity();
    this.children.forEach(child => child.launchChangeValue());
  }

  public disable() {
    this.formControl?.disable();
    this.children.forEach(child => child.disable());
  }

  public enable() {
    if (!this._isVisible) return;
    this.formControl?.enable();
    this.children.forEach(child => child.enable());
  }

  public destroy() {
    this.changeValue$.complete();
    this._subscriberHandler.destroy();
  }
}
