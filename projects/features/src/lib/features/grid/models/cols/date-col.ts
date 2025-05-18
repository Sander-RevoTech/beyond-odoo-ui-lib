import { InputDatePicker } from '@beyond/form-model';

import { BaseCol } from './base-col';

export class DateCol extends BaseCol<Date> {
  public override getInputForm() {
    return new InputDatePicker({
      key: this.key,
      label: this.inputLabel,
      rangeEnabled: true,
    });
  }
}
