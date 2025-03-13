import { IInputBase, InputBase } from './base';

export interface IInputTextarea<T> extends IInputBase<T> {}

export class InputTextarea extends InputBase<string> {
  override controlType = 'textarea';

  constructor(options: IInputTextarea<string> = {}) {
    super(options);
  }
}
