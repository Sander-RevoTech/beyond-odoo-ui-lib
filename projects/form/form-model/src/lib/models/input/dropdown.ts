import { Observable, of } from 'rxjs';

import { IInputBase, InputBase } from './base';

export interface IInputDropdown<T> extends IInputBase<T> {
  options?: Observable<{ id: string; name: string }[]>;
  multiple?: boolean;
  showNothingOption?: boolean;
  withSearch?: boolean;
  width?: string;
  valueChanged?: (data?: string) => void;
}
export class InputDropdown<T = string | string[]> extends InputBase<T> {
  override controlType = 'dropdown';
  options: Observable<{ id: string; name: string; disabled?: boolean }[]>;
  multiple: boolean;
  showNothingOption: boolean = false;
  withSearch: boolean = false;
  width?: string;

  constructor(options: IInputDropdown<T> = {}) {
    super(options);
    this.options = options['options'] || of([]);
    this.multiple = options['multiple'] || false;
    this.showNothingOption = !this.multiple ? !!options.showNothingOption : false;
    this.width = options.width || '100%';
    this.withSearch = options.withSearch || false;
  }
}
