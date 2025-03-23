import { FormGroup } from '@angular/forms';

import { IInputBase, InputBase } from './base';
import { Observable, of } from 'rxjs';

export interface IInputLabel extends IInputBase<null> {
  extraInfo?: Observable<string>;
}
export class InputLabel extends InputBase<null> implements IInputLabel {
  extraInfo: Observable<string>;
  constructor(options: IInputLabel = {}) {
    super(options);

    this.extraInfo = options.extraInfo ? options.extraInfo : of('');
    this.controlType = 'label';
  }
}
