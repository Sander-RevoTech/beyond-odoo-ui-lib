import { Injectable, inject } from '@angular/core';

import { BydGridData } from '../models/grid-data';
import { BydGridFormService } from './grid-form.services';

@Injectable({
  providedIn: 'root',
})
export class BydGridInstanceService<T> {
  public readonly grids: { [index: string]: BydGridData<T> } = {};

  constructor() {}

  public create(key: string) {
    if (!this.has(key)) {
      this.grids[key] = new BydGridData<T>(key);
    }
  }

  public get(key: string, create: boolean = false) {
    if (!this.has(key) && create) {
      this.create(key);
    }
    return this.grids[key];
  }

  public has(key: string) {
    return !!this.grids[key];
  }
}
