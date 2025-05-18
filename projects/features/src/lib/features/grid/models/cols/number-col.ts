import { InputLabel, InputNumber, InputPanel } from '@beyond/form-model';

import { BaseCol } from './base-col';

export class NumberCol extends BaseCol<Number> {
  public override getInputForm() {
    return new InputPanel({
      key: 'number-panel',
      contentClass: 'row g-0',
      children: [
        new InputLabel({
          key: 'number-panel-label',
          label: this.inputLabel,
          class: 'col-12',
        }),
        new InputNumber({
          key: this.key + '#min',
          label: 'min',
        }),
        new InputNumber({
          key: this.key + '#max',
          label: 'max',
        }),
      ],
    });
  }
}
