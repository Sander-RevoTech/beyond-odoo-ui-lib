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
      value: value,
    };
  }
}

// export class BaseFilterComponent<T extends AdvancedFilterModel, U extends BaseCol<T>> implements IFilter {
//   public input: InputBase<any> | null = null;

//   protected _col: U | null = null;
//   protected _model: T | null = null;
//   protected _params: IFilterParams<unknown, GridContext> | null = null;

//   agInit(params: IFilterParams) {
//     this._params = params;
//     this._col = params.context.cols[params.column.getColId()] ?? null;

//     this.setInput();
//   }

//   isFilterActive() {
//     this.setInput();
//     return !!this._model;
//   }
//   getModel() {
//     return this._model;
//   }
//   setModel(model: any): void | AgPromise<void> {
//     this._model = model;
//   }
//   refresh?(newParams: IFilterParams): boolean {
//     console.log('Method refresh not implemented.');
//     return true;
//   }
//   doesFilterPass(params: IDoesFilterPassParams): boolean {
//     if (!this._col?.key) {
//       return true;
//     }
//     const data = params.data[this._col?.key];
//     if (!data || !this._model) {
//       return true;
//     }
//     return this._validateDataAgainstModel(data, this._model);
//   }

//   getTags(): ActiveFilterTag[] {
//     return [];
//   }

//   getModelAsString(model: ISimpleFilter): string {
//     return '';
//   }

//   apply(data: any) {
//     this.setModel(this._col?.getFiltersModel(data));

//     this._params?.api.onFilterChanged();
//     this._params?.context.grid.applyFilterModel({}, FilterModelSource.storage);
//   }

//   setInput() {
//     if (this.input) {
//       this.input.destroy();
//     }
//     this.input = this._col?.getInputForm(true) ?? null;
//     this.input?.createFormControl();
//     this.input?.changeValue$.subscribe({
//       next: value => {
//         const data: any = [];
//         data[this._col?.key ?? ''] = value;

//         this.apply(data);
//       },
//     });
//   }

//   private _validateDataAgainstModel(data: any, model: AdvancedFilterModel): boolean {
//     if (model.filterType === 'join') {
//       // Validation for JoinAdvancedFilterModel
//       if (!Array.isArray(model.conditions)) return false;

//       if (model.type === 'AND') {
//         return model.conditions.every(condition => this._validateDataAgainstModel(data, condition));
//       } else if (model.type === 'OR') {
//         return model.conditions.some(condition => this._validateDataAgainstModel(data, condition));
//       }
//     }

//     if (['text', 'number', 'date', 'dateString', 'boolean'].includes(model.filterType)) {
//       // Validation for ColumnAdvancedFilterModel
//       switch (model.filterType) {
//         case 'text':
//           return this._validateTextCondition(data, model.type, model.filter);
//         case 'number':
//           return this._validateScalarCondition(data, model.type, model.filter);
//         case 'date':
//         case 'dateString':
//           return this._validateScalarCondition(
//             new Date(data).getTime(),
//             model.type,
//             model.filter ? new Date(model.filter).getTime() : undefined
//           );
//         case 'boolean':
//           return this._validateBooleanCondition(data, model.type);
//         default:
//           return false;
//       }
//     }

//     return false;
//   }

//   private _validateTextCondition(data: string, type: TextAdvancedFilterModelType, filter?: string): boolean {
//     switch (type) {
//       case 'equals':
//         return data === filter;
//       case 'notEqual':
//         return data !== filter;
//       case 'contains':
//         return filter ? data.includes(filter) : false;
//       case 'notContains':
//         return filter ? !data.includes(filter) : true;
//       case 'startsWith':
//         return filter ? data.startsWith(filter) : false;
//       case 'endsWith':
//         return filter ? data.endsWith(filter) : false;
//       case 'blank':
//         return data === '';
//       case 'notBlank':
//         return data !== '';
//       default:
//         return false;
//     }
//   }

//   private _validateScalarCondition(data: number, type: ScalarAdvancedFilterModelType, filter?: number): boolean {
//     switch (type) {
//       case 'equals':
//         return data === filter;
//       case 'notEqual':
//         return data !== filter;
//       case 'lessThan':
//         return filter !== undefined && data < filter;
//       case 'lessThanOrEqual':
//         return filter !== undefined && data <= filter;
//       case 'greaterThan':
//         return filter !== undefined && data > filter;
//       case 'greaterThanOrEqual':
//         return filter !== undefined && data >= filter;
//       case 'blank':
//         return data === null || data === undefined;
//       case 'notBlank':
//         return data !== null && data !== undefined;
//       default:
//         return false;
//     }
//   }

//   private _validateBooleanCondition(data: boolean, type: BooleanAdvancedFilterModelType): boolean {
//     return (type === 'true' && data === true) || (type === 'false' && data === false);
//   }
// }
