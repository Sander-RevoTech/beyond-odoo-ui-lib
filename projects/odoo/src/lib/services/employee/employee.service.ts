import { Injectable } from '@angular/core';

import { filter, map } from 'rxjs/operators';

import { BydBaseOdooService } from '../baseService';
import { Employee } from './dto/employee';

@Injectable({
  providedIn: 'root',
})
export class BydEmployeeService extends BydBaseOdooService {
  constructor() {
    super();
  }

  public searchByName$(name: string) {
    return this._odooService
      .searchRead$<Employee>('hr.employee', [['name', 'ilike', name]], ['id', 'name'])
      .pipe(filter(data => !!data));
  }
  public getRelatedByUserId$(userId: number) {
    return this._odooService
      .searchRead$<Employee>('hr.employee', [['external_app_user', '=', userId]], ['id', 'name'])
      .pipe(
        filter(data => !!data),
        map(data => data[0])
      );
  }
  public getWarehouses$(id: number) {
    return this._odooService.searchRead$<Employee>('hr.employee', [['id', '=', id]], ['id', 'warehouse_ids']).pipe(
      filter(data => !!data),
      map(data => data[0]?.warehouse_ids || null)
    );
  }
}
