import { InputNumber, InputPanel } from '@beyond/form-model';

import { Filter } from '../types';
import { BaseCol } from './base-col';

export class NumberCol extends BaseCol<Number> {
  public override getInputForm() {
    return new InputPanel({
      key: 'number-panel',
      contentClass: 'row g-0',
      children: [
        new InputNumber({
          key: this.key,
          label: this.inputLabel,
          value: this.filterValues[0]?.toString(),
        }),
      ],
    });
  }

  public override formatInputForm(data: any): Filter | null {
    const value = data[this.key];

    if (!value) {
      return null;
    }

    return {
      field: this.key,
      type: '=',
      value: value,
    };
  }
}
