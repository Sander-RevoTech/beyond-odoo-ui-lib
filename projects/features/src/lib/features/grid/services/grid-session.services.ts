import { Injectable } from '@angular/core';

import { HandleComplexRequest } from '@beyond/server';

import { Filter } from '../models/types';

@Injectable({
  providedIn: 'root',
})
export class BydGridSessionService {
  private _filterData = new HandleComplexRequest<Filter[]>();

  public setFilter(key: string, filter: Filter[]) {
    this._filterData.update(key, filter);
  }
  public getFilter(key: string) {
    return this._filterData.get(key);
  }

  public clearFilter(key: string): void {
    this._filterData.update(key, []);
  }
}
