import { Injectable } from '@angular/core';

import { BydBaseOdooService } from '@beyond/odoo';
import { filter, map, mergeMap, Observable } from 'rxjs';
import { ajaxRequestFuncParams, ajaxResponse } from '../models/types';
import { isNonNullable } from '@beyond/utils';

@Injectable({
  providedIn: 'root',
})
export class BydGridViewService extends BydBaseOdooService {

  constructor() {
    super();
  }


  public getData$<T>(model: string, ajaxParam: ajaxRequestFuncParams, fields: (keyof T)[]): Observable<ajaxResponse<T>> {
    const filterParams = ajaxParam.filter.map(f => [f.field, f.type, f.value]) ?? [];
    const orderParams = ajaxParam.sort.map(s => `${s.field} ${s.dir}`).join(',') ?? '';

    return  this._odooService
          .searchCount$(model, filterParams).pipe(mergeMap((count) => this._odooService
          .searchRead$<T>(
            model,
            filterParams,
            fields,
            { "order": orderParams, "offset": (ajaxParam.page - 1) * ajaxParam.size, "limit": ajaxParam.size }
          )
          .pipe(
            filter(isNonNullable),
            map((data) => ({
                data: data,
                last_page: Math.ceil(count / ajaxParam.size),
              })
            )
          )));
  }
  
}
