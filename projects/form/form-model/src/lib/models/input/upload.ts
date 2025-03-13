import { IInputBase, InputBase } from './base';

export type InputUploadValue = {
  id: string;
  url: string;
  name?: string;
};

export interface IInputUpload extends IInputBase<InputUploadValue[]> {
  confirmButton?: boolean;
}

export class InputUpload extends InputBase<InputUploadValue[]> {
  confirmButton: boolean;

  constructor(options: IInputUpload) {
    super(options);
    this.controlType = 'upload';
    this.confirmButton = options.confirmButton ?? false;
  }

  public confirmValue(ids: InputUploadValue[]) {
    this.formControl?.setValue(ids);
  }
}
