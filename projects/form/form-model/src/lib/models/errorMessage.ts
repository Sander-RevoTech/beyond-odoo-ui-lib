import { InputBase } from './input/base';
import { InputLabel } from './input/label';
import { InputPanel } from './input/panel';

export class FormErrorMessage {
  static updateFormMessage(form: InputBase<any>[], key: string, message: string) {
    for (const input of form) {
      if (input instanceof InputLabel) {
        continue;
      }
      if (input.key === key) {
        input.formControl?.setErrors({ message: message });
      }
      if (input instanceof InputPanel && input.children && input.children.length > 0) {
        FormErrorMessage.updateFormMessage(input.children, key, message);
      }
    }
  }
}
