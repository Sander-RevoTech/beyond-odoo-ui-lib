import { Injectable } from '@angular/core';

import { BehaviorSubject, filter, tap } from 'rxjs';

import { BydBaseOdooService } from '../baseService';
import { Partners } from './dto/partners';

@Injectable({
  providedIn: 'root',
})
export class BydPartnersService extends BydBaseOdooService {
  public partners$ = new BehaviorSubject<Partners[]>([]);

  constructor() {
    super();
  }

  public fetchList(value: string) {
    return this._odooService
      .searchRead$<Partners>('res.partner', [['name', 'ilike', '%' + value.toLowerCase() + '%']], ['id', 'name'], {
        limit: 30,
      })
      .pipe(
        filter(data => !!data),
        tap(entities => {
          this.partners$.next(entities);
        })
      );
  }

  public fetchListById(id: string) {
    return this._odooService
      .searchRead$<Partners>('res.partner', [['id', '=', id]], ['id', 'name'], { limit: 50 })
      .pipe(
        filter(data => !!data),
        tap(entities => {
          this.partners$.next(entities);
        })
      );
  }
}
