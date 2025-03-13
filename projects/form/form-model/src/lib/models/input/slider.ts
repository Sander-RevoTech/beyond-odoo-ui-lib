import { IInputBase, InputBase } from './base';

export interface IInputSlider extends IInputBase<number> {
  min?: number;
  max?: number;
}

export class InputSlider extends InputBase<number> {
  public min: number;
  public max: number;

  override controlType = 'slider';

  constructor(options: IInputSlider = {}) {
    super(options);

    this.min = options.min || 0;
    this.max = options.max || 100;
  }
}
