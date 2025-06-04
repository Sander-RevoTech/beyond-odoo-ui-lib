import { InputDropdown, InputPanel } from '@beyond/form-model';
import { of } from 'rxjs';

import { BaseCol } from './base-col';

export class EnumCol extends BaseCol<string> {
  public override getInputForm() {
    return new InputPanel({
      key: 'enum-panel',
      contentClass: 'row g-0',
      children: [
        new InputDropdown({
          key: this.key,
          label: this.inputLabel,
          options: of(
            this.data.col.enumValues?.map(value => ({
              id: value,
              name: value,
            })) ?? []
          ),
          value: this.filterValues[0] || '',
        }),
      ],
    });
  }
}
