import { Injectable } from '@angular/core';

import { filter } from 'rxjs/operators';

import { HandleSimpleRequest } from '@beyond/server';

import { BydBaseOdooService } from '../baseService';
import { Warehouse } from './dto/warehouse';

@Injectable({
  providedIn: 'root',
})
export class BydWarehousesService extends BydBaseOdooService {
  public warehouse = new HandleSimpleRequest<Warehouse[]>();

  constructor() {
    super();
  }

  public fetch$(ids: number[]) {
    return this.warehouse.fetch(
      this._odooService
        .searchRead$<Warehouse>('stock.warehouse', [['id', 'in', ids]], ['id', 'name'])
        .pipe(filter(data => !!data))
    );
  }
}
