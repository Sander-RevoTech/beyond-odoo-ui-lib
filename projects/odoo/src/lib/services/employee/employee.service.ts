import { Injectable } from '@angular/core';

import { filter } from 'rxjs/operators';

import { Employee } from './dto/employee';
import { BydBaseOdooService } from '../baseService';


@Injectable({
  providedIn: 'root',
})
export class BydEmployeeService extends BydBaseOdooService {
  constructor() {
    super();
  }

  public searchByName$(name: string) {
    return this._odooService
      .searchRead$<Employee>(
        'hr.employee',
        [['name', 'ilike', name]],
        ['id', 'name']
      )
      .pipe(
        filter(data => !!data),
      );
  }
}
