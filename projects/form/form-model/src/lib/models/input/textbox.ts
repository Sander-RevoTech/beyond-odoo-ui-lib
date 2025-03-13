import { IInputBase, InputBase } from './base';

export interface IInputTextBox<T> extends IInputBase<T> {
  type?: string;
  icon?: string;
  iconClicked?: () => void;
}

export class InputTextBox extends InputBase<string> {
  override controlType = 'textbox';
  icon?: string | null;
  iconClicked?: () => void;

  constructor(options: IInputTextBox<string> = {}) {
    super(options);
    this.type = options.type || 'text';
    this.icon = options.icon || null;
    this.iconClicked = options.iconClicked;
  }
}
