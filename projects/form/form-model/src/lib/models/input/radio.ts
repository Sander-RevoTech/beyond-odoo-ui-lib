import { Observable, of } from 'rxjs';

import { IInputBase, InputBase } from './base';

export interface IInputRadio<T> extends IInputBase<T> {
  options?: Observable<{ id: T; name?: string; icon?: string }[]>;
  useMaterialTheme?: boolean;
}
export class InputRadio<T> extends InputBase<T> {
  override controlType = 'radio';
  useMaterialTheme: boolean;
  options: Observable<{ id: T; name?: string; icon?: string }[]>;

  constructor(options: IInputRadio<T> = {}) {
    super(options);
    this.options = options['options'] || of([]);
    this.type = 'radioGroup';
    this.useMaterialTheme = options.useMaterialTheme || false;
  }
}
