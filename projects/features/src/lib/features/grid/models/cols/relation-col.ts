import { InputChoices, InputTextBox } from '@beyond/form-model';

import { Filter } from '../types';
import { BaseCol } from './base-col';

export class RelationCol extends BaseCol<string> {
  public override getInputForm() {
    if (this.data.col.dataSearch$) {
      return new InputChoices({
        key: this.key,
        label: this.inputLabel,
        class: 'pb-2',
        advancedSearch$: this.data.col.dataSearch$,
        value: this.filterValues[0],
      });
    }

    return new InputTextBox({
      key: this.key,
      value: this.filterValues[0],
    });
  }

  public override formatInputForm(data: any): Filter | null {
    const value = data[this.key];

    if (!value) {
      return null;
    }

    return {
      field: this.key,
      type: this.data.col.multivalues ? 'in' : '=',
      value: Number(value),
    };
  }
}
