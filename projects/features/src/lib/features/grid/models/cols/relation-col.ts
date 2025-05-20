import { InputChoices, InputTextBox } from '@beyond/form-model';

import { BaseCol } from './base-col';

export class RelationCol extends BaseCol<string> {
  public override getInputForm() {
    if (this.data.col.dataSearch$) {
      new InputChoices({
        key: this.key,
        label: this.inputLabel,
        class: 'pb-2',
        advancedSearch$: this.data.col.dataSearch$,
      });
    }

    return new InputTextBox({
      key: this.key,
    });
  }
}
