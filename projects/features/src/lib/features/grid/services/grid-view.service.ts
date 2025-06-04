import { Injectable } from '@angular/core';

import { BydBaseOdooService } from '@beyond/odoo';
import { isNonNullable } from '@beyond/utils';
import { Observable, filter, map, mergeMap, of } from 'rxjs';

import { ParameterType, ajaxRequestFuncParams, ajaxResponse } from '../models/types';

@Injectable({
  providedIn: 'root',
})
export class BydGridViewService extends BydBaseOdooService {
  constructor() {
    super();
  }

  public getData$<T>(
    model: string,
    ajaxParam: ajaxRequestFuncParams,
    fields: (keyof T)[]
  ): Observable<ajaxResponse<T>> {
    const filterParams = ajaxParam.filter.map(f => [f.field, f.type, f.value]) ?? [];
    const orderParams = ajaxParam.sort.map(s => `${s.field} ${s.dir}`).join(',') ?? '';
    const groupBy = ajaxParam.groupBy;

    return this._odooService.searchCount$(model, filterParams).pipe(
      mergeMap(count =>
        this._odooService
          .searchRead$<T>(model, filterParams, fields, {
            order: groupBy ? `${groupBy} asc ${orderParams ? ',' + orderParams : ''}` : orderParams,
            offset: (ajaxParam.page - 1) * ajaxParam.size,
            limit: ajaxParam.size,
          })
          .pipe(
            filter(isNonNullable),
            map(data => {
              const mapping = ajaxParam.colsMetaData
                .filter(col => col.type === ParameterType.Relation)
                .map(col => ({ from: col.name, to: col.name.split('_')[0] }));

              if (!mapping || mapping.length === 0) {
                return data;
              }
              return data.map(entity =>
                this._handleJoinData(entity, mapping as Array<{ from?: keyof T; to: keyof T }>)
              );
            }),
            map(data => ({
              data: data,
              total: count,
              last_page: Math.ceil(count / ajaxParam.size),
            }))
          )
      )
    );
  }
}
