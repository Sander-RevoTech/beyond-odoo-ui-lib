import { FormGroup } from '@angular/forms';

import { IInputBase, InputBase } from './base';

export interface IInputLabel extends IInputBase<null> {}
export class InputLabel extends InputBase<null> implements IInputLabel {
  constructor(options: IInputLabel = {}) {
    super(options);

    this.controlType = 'label';
  }

  public override createFormControl(group?: FormGroup) {}
}
