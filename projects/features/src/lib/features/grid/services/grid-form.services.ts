import { Injectable } from '@angular/core';

import { InputBase, InputDropdown, InputPanel } from '@beyond/form-model';
import { isNonNullable } from '@beyond/utils';
import { of } from 'rxjs';

import { BydGridData } from '../models/grid-data';
import { Filter } from '../models/types';

@Injectable({
  providedIn: 'root',
})
export class BydGridFormService<T> {
  constructor() {}

  public getFiltersForm(model: BydGridData<T>): InputBase<any>[] {
    const keys = Object.keys(model.cols);
    if (!keys || keys.length === 0) {
      return [];
    }

    return [
      new InputPanel({
        key: 'main-panel',
        class: 'p-space-sm',
        children: keys.map(key => model.cols[key].getInputForm()).filter(isNonNullable),
      }),
    ];
  }

  public formatFiltersForm(model: BydGridData<T>, data: any): Filter[] {
    return Object.keys(model.cols).reduce<Filter[]>((acc, key) => {
      const filter = model.cols[key].formatInputForm(data);

      if (!filter) {
        return acc;
      }
      return [...acc, filter];
    }, []);
  }

  public getGroupForm(model: BydGridData<T>): InputBase<any>[] {
    return [
      new InputPanel({
        key: 'main-panel',
        class: 'p-space-sm',
        children: [
          new InputDropdown({
            key: 'group',
            label: `grid.${model.scope}.groupBy`,
            options: of(
              Object.values(model.cols).map(group => ({
                id: group.key,
                name: group.key,
              }))
            ),
          }),
        ],
      }),
    ];
  }

  public formatGroupForm(data: any): string | null {
    return data['group'] || null;
  }
}
