import { FormGroup } from '@angular/forms';

import { Observable, of } from 'rxjs';

import { IInputBase, InputBase } from './base';

export interface IInputLabel extends IInputBase<unknown> {
  extraInfo?: Observable<string>;
}
export class InputLabel extends InputBase<unknown> implements IInputLabel {
  extraInfo: Observable<string>;
  constructor(options: IInputLabel = {}) {
    super(options);

    this.extraInfo = options.extraInfo ? options.extraInfo : of('');
    this.controlType = 'label';
  }
}
