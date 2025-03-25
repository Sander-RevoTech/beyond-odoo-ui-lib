import { IInputDropdown, InputDropdown } from './dropdown';

export interface IInputChoices<T> extends IInputDropdown<T> {}
export class InputChoices<T = string | string[]> extends InputDropdown<T> {
  override controlType = 'choices';

  constructor(options: IInputChoices<T> = {}) {
    super(options);
  }
}
