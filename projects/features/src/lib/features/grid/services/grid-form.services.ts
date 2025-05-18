import { Injectable } from '@angular/core';

import { InputBase, InputPanel } from '@beyond/form-model';
import { isNonNullable } from '@beyond/utils';

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
        label: `grid.${model.scope}.title`,
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
}
