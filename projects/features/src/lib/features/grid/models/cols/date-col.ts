import { InputDatePicker } from '@beyond/form-model';

import { Filter } from '../types';
import { BaseCol } from './base-col';

export class DateCol extends BaseCol<Date> {
  public override getInputForm() {
    return new InputDatePicker({
      key: this.key,
      label: this.inputLabel,
      rangeEnabled: true,
    });
  }

  public override formatInputForm(data: any): Filter | null {
    const value = data[this.key];

    if (!value) {
      return null;
    }

    return {
      field: this.key,
      type: 'like',
      value: value,
    };
  }
}
