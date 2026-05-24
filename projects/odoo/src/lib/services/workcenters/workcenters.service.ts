import { Injectable } from '@angular/core';

import { filter, map } from 'rxjs/operators';

import { HandleSimpleRequest } from '@beyond/server';

import { BydBaseOdooService } from '../baseService';
import { Workcenter } from './dto/workcenter';

@Injectable({
  providedIn: 'root',
})
export class BydWorkcentersService extends BydBaseOdooService {
  public workcenters = new HandleSimpleRequest<Workcenter[]>();
  public workcenter = new HandleSimpleRequest<Workcenter>();

  constructor() {
    super();
  }

  public fetch$(ids: number[], warehouseId: number) {
    return this.workcenters.fetch(
      this._odooService
        .searchRead$<Workcenter>(
          'mrp.workcenter',
          [
            ['id', 'in', ids],
            ['warehouse_id', '=', warehouseId],
          ],
          ['id', 'name']
        )
        .pipe(filter(data => !!data))
    );
  }

  public get$(id: number) {
    return this.workcenter.fetch(
      this._odooService.searchRead$<Workcenter>('mrp.workcenter', [['id', '=', id]], ['id', 'name']).pipe(
        filter(data => !!data),
        map(data => data[0])
      )
    );
  }
}
