import { inject, Injectable } from '@angular/core';
import { BydBaseOdooService } from '@beyond/odoo';

import { BehaviorSubject, filter, tap } from 'rxjs';
import { Profile } from './dto/profile';
import { BydPermissionsServices } from '@beyond/server';


@Injectable({
  providedIn: 'root',
})
export class BydUserService extends BydBaseOdooService {
  readonly profile$ = new BehaviorSubject<Profile | null>(null);
  readonly permissionsServices = inject(BydPermissionsServices);

  constructor() {
    super();
  }

  public fetchProfile$() {
    if (!this.permissionsServices.uid) {
      return null;
    }
    return this._odooService
      .searchRead<Profile[], Profile>('res.users', [['id', '=', this.permissionsServices.uid]], {
        fields: ['id', 'email', 'display_name'],
      })
      .pipe(
        filter(data => !!data),
        tap(entities => {
          if (entities.length > 0) {
            this.profile$.next(entities[0]);
          }
        })
      );
  }
}
