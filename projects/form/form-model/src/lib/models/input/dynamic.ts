import { FormGroup } from '@angular/forms';

import { Subject } from 'rxjs';

import { FactoryInputType, InputFactory } from '../factory';
import { IInputBase, InputBase } from './base';

interface IInputTemplateDynamic {
  type: FactoryInputType;
  options: IInputChildrenDynamic;
}
export interface IInputChildrenDynamic extends IInputBase<any> {
  templateChildren?: () => InputBase<any>[];
}
export interface IInputDynamic extends IInputBase<any> {
  inputsGroup?: { [key: string]: InputBase<any>[] };
  template?: IInputTemplateDynamic[];
}
export class InputDynamic extends InputBase<{ [index: string]: any }> {
  listChanged$ = new Subject<void>();

  inputsGroup: { [key: string]: InputBase<any>[] };
  template: IInputTemplateDynamic[];
  firstRender: boolean = true;
  composedKeyForGroup: boolean = true;

  declare formControl?: FormGroup;

  constructor(options: IInputDynamic = {}) {
    super(options);
    this.inputsGroup = options.inputsGroup || {};
    this.template = options.template || [];

    this.controlType = 'dynamic';
  }

  public add(key?: string) {
    const templates: InputBase<any>[] = [];
    const value = key && this.value ? this.value[key] : null;
    for (const template of this.template) {
      templates.push(
        InputFactory.getInput(template.type, {
          ...template.options,
          ...{ value: value ? value[template.options.key ?? ''] : null },
        })
      );
    }
    this._addControl(templates, key ?? this._inputKey());
    this.listChanged$.next();
  }
  public remove(id: string) {
    if (this.inputsGroup[id]) {
      this.formControl?.removeControl(this.key + '-' + id);
      delete this.inputsGroup[id];
    }
    this.listChanged$.next();
  }
  public override createFormControl(group: FormGroup): void {
    this.formControl = new FormGroup({});
    const inputGroupKeys = Object.keys(this.inputsGroup);
    inputGroupKeys.forEach(key => {
      this._addControl(this.inputsGroup[key], key);
    });
    if (this.firstRender && this.template && inputGroupKeys.length === 0) {
      this.add();
    }
    group.addControl(this.key, this.formControl);
  }

  private _addControl(inputs: InputBase<any>[], key: string): void {
    const childGroup = new FormGroup({});
    inputs.forEach(input => {
      input.createFormControl(childGroup);
    });
    this.formControl?.addControl(this.composedKeyForGroup ? this.key + '-' + key : key, childGroup);
    this.inputsGroup[key] = inputs;
  }

  private _inputKey(): string {
    return '' + Math.floor(Math.random() * 10000);
  }
}
