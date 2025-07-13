import { InputBase } from '@beyond/form-model';
import { Observable } from 'rxjs';
import { ColumnDefinition } from 'tabulator-tables';

import { BydGridData } from '../grid-data';
import { ColMetaData, Filter } from '../types';

export const operatorMap: { [key: string]: string } = {
  contains: '%',
  greaterThan: '>',
  lessThan: '<',
  equals: '=',
  notEqual: '!=',
  greaterThanOrEqual: '>=',
  lessThanOrEqual: '<=',
};
export interface IFilterOptions {
  allow: boolean;
}
export interface IBaseCol {
  scope: string;
  col: ColMetaData;
}

export class BaseCol<T> {
  public data: IBaseCol;
  public model: BydGridData<any>;

  get key() {
    return this.data.col.name;
  }

  get inputLabel() {
    return `grid.${this.data.scope}.core.${this.data.col.name}`;
  }
  get filterValues(): T[] {
    return (
      this.model.filters
        ?.get()
        .find(filter => filter.key === this.key)
        ?.values.map(f => f.value) || []
    );
  }
  constructor(data: IBaseCol, model: BydGridData<any>) {
    this.data = data;
    this.model = model;
  }

  public getColDef(): ColumnDefinition {
    return {
      field: this.key,
      title: this.inputLabel,
      headerFilter: 'input',
    };
  }

  public getInputForm(): InputBase<any> | null {
    return null;
  }
  public formatInputForm(data: any): Filter | null {
    const value = data[this.key];

    if (!value) {
      return null;
    }

    return {
      field: this.key,
      type: '=',
      value: value.trim(),
    };
  }
}
