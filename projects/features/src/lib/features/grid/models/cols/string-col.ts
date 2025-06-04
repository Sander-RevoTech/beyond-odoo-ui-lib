import { InputTextBox } from '@beyond/form-model';

import { Filter } from '../types';
import { BaseCol } from './base-col';

export class StringCol extends BaseCol<string> {
  public override getInputForm() {
    // const value = this.values;

    return new InputTextBox({
      key: this.key,
      label: this.inputLabel,
      class: 'pb-2',
      value: this.filterValues[0] || '',
    });
  }

  public override formatInputForm(data: any): Filter | null {
    const value = data[this.key];

    if (!value || value === '' || value.length === 0) {
      return null;
    }

    return {
      field: this.key,
      type: 'like',
      value: value,
    };
  }
}
