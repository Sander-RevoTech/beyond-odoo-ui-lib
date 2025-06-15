import { Injectable } from '@angular/core';

import { filter, map } from 'rxjs/operators';

import { HandleSimpleRequest } from '@beyond/server';

import { BydBaseOdooService } from '../baseService';
import { Company } from './dto/company';

@Injectable({
  providedIn: 'root',
})
export class BydCompaniesService extends BydBaseOdooService {
  public companies = new HandleSimpleRequest<Company[]>();
  public company = new HandleSimpleRequest<Company>();

  constructor() {
    super();
  }

  public fetch$(ids: number[]) {
    return this.companies.fetch(
      this._odooService
        .searchRead$<Company>('res.company', [['id', 'in', ids]], ['id', 'name'])
        .pipe(filter(data => !!data))
    );
  }

  public get$(id: number) {
    return this.company.fetch(
      this._odooService.searchRead$<Company>('res.company', [['id', '=', id]], ['id', 'name']).pipe(
        filter(data => !!data),
        map(data => data[0])
      )
    );
  }
}
