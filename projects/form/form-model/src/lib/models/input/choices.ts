import { TemplateRef } from '@angular/core';

import { Observable } from 'rxjs';

import { IInputDropdown, InputDropdown } from './dropdown';

export type InputChoicesOption = {
  id: string;
  name: string;
  disabled?: boolean;
  data: any;
};

export interface IInputChoices extends IInputDropdown<string> {
  options?: Observable<InputChoicesOption[]>;
  advancedSearch$?: (search?: string) => Observable<InputChoicesOption[]>;
}
export class InputChoices extends InputDropdown<string> {
  override controlType = 'choices';
  declare options: Observable<InputChoicesOption[]>;

  public advancedSearch$: ((search?: string) => Observable<InputChoicesOption[]>) | null;

  constructor(options: IInputChoices = {}) {
    super(options);

    this.advancedSearch$ = options['advancedSearch$'] || null;
  }
}
