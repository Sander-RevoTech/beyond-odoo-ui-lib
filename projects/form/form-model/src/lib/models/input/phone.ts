import { InputBase } from './base';
import { IInputTextBox } from './textbox';

export class InputPhone extends InputBase<string> {
  override controlType = 'phone';
  preferredCountries: string[];

  constructor(options: IInputTextBox<string> = {}) {
    super(options);
    this.type = 'tel';
    this.preferredCountries = ['be', 'fr'];
  }
}
