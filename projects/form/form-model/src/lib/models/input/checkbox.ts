import { IInputBase, InputBase } from './base';

export interface IInputCheckBox extends IInputBase<boolean> {
  toggle?: boolean;
}

export class InputCheckBox extends InputBase<boolean> {
  override controlType = 'checkbox';

  constructor(options: IInputCheckBox = {}) {
    super(options);

    if (options.toggle === true) {
      this.controlType = 'toggle';
    }

    if (!this.value) {
      this.value = false;
    }
  }
}
