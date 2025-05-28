import { ElementRef, signal } from '@angular/core';

import { BehaviorSubject, Observable, Subject, firstValueFrom } from 'rxjs';
import { ColumnDefinition, TabulatorFull as Tabulator } from 'tabulator-tables';

import { BaseCol } from './cols/base-col';
import { BoolCol } from './cols/bool-col';
import { DateCol } from './cols/date-col';
import { EnumCol } from './cols/enum-col';
import { NumberCol } from './cols/number-col';
import { RelationCol } from './cols/relation-col';
import { StringCol } from './cols/string-col';
import { BydGridFilters } from './grid-filters';
import { ColMetaData, ParameterType, ViewType, ajaxRequestFuncParams, ajaxResponse } from './types';
import { groupBy } from './utils';

export interface IDataService<T> {
  getData$: (params: ajaxRequestFuncParams) => Observable<ajaxResponse<T>>;
}

export class BydGridData<T> {
  get data(): T[] {
    return this.table?.getData() ?? [];
  }
  get dataByGroup() {
    return groupBy(this.groupBy, this.data);
  }
  get isGroup() {
    return this.groupBy !== null;
  }

  public readonly rowClicked$ = new Subject<T>();
  public table: Tabulator | null = null;
  public cols: { [index: string]: BaseCol<any> } = {};
  public filters: BydGridFilters | null = null;

  public readonly isReady$ = new BehaviorSubject(false);

  public tableHtml: ElementRef | null = null;
  public readonly displayType = signal<ViewType>('card');

  public groupBy: keyof T | null = null;

  constructor(public readonly scope: string) {}

  public init(params: { elementRef: ElementRef; colsMetaData: ColMetaData[]; services: IDataService<T> }) {
    this.table = new Tabulator(params.elementRef.nativeElement, {
      height: '500px',
      layout: 'fitColumns',
      paginationMode: 'remote',
      pagination: true,
      paginationSize: 20,
      paginationInitialPage: 1,
      ajaxFiltering: true,
      filterMode: 'remote',

      ajaxSorting: true,
      sortMode: 'remote',

      columns: this._getColumns(params.colsMetaData),

      ajaxURL: 'dummy',
      ajaxRequestFunc: (url: string, config: any, ajaxParams: ajaxRequestFuncParams): Promise<ajaxResponse<T>> => {
        return firstValueFrom(params.services.getData$({ ...ajaxParams, groupBy: this.groupBy as string }));
      },
      ajaxResponse: function (_: any, __: any, response: ajaxResponse<T>) {
        return response;
      },
    });

    this.table.on('tableBuilt', () => {
      this.tableHtml = params.elementRef;
      this.filters = new BydGridFilters(this.scope, this.table!);
      this.isReady$.next(true);
    });
    this.table.on('rowClick', (_e, row) => {
      this.rowClicked$.next(<T>row.getData());
    });
  }

  public destroy() {
    this.table?.destroy();
  }

  public setGroupBy(field: string) {
    this.groupBy = field as keyof T;
    this.table?.setGroupBy(field);
    this.table?.setData();
  }
  public clearGroupBy() {
    this.groupBy = null;
    this.table?.setGroupBy([]);
    this.table?.setData();
  }

  public switchView(type: ViewType) {
    this.displayType.set(type);
  }

  private _getColumns(colsMetaData: ColMetaData[]): ColumnDefinition[] {
    this.cols = Object.fromEntries(
      colsMetaData.map(meta => {
        const field = this._factoryCols(meta);
        return [field.key, field];
      })
    );

    return Object.keys(this.cols)
      .filter(key => !key.startsWith('_'))
      .map(key => ({ ...this.cols[key].getColDef() }));
  }

  private _factoryCols(col: ColMetaData): BaseCol<any> {
    switch (col.type) {
      case ParameterType.String:
        return new StringCol({ scope: this.scope, col: col }, this);
      case ParameterType.Enum:
        return new EnumCol({ scope: this.scope, col: col }, this);
      case ParameterType.Number:
        return new NumberCol({ scope: this.scope, col: col }, this);
      case ParameterType.DateTime:
        return new DateCol({ scope: this.scope, col: col }, this);
      case ParameterType.Boolean:
        return new BoolCol({ scope: this.scope, col: col }, this);
      case ParameterType.Relation:
        return new RelationCol({ scope: this.scope, col: col }, this);
      default:
        return new BaseCol({ scope: this.scope, col: col }, this);
    }
  }
}
