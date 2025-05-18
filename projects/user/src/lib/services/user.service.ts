import { Injectable, inject } from '@angular/core';

import { BydBaseOdooService } from '@beyond/odoo';
import { BydPermissionsServices, HandleSimpleRequest } from '@beyond/server';
import { isNonNullable } from '@beyond/utils';
import { filter, map, mergeMap, of, tap } from 'rxjs';

import { Profile } from './dto/profile';

@Injectable({
  providedIn: 'root',
})
export class BydUserService extends BydBaseOdooService {
  readonly profile$ = new HandleSimpleRequest<Profile>();
  readonly permissionsServices = inject(BydPermissionsServices);

  constructor() {
    super();
    this.permissionsServices.updated$.pipe(mergeMap(() => this.fetchProfile$())).subscribe();
  }

  public fetchProfile$() {
    if (!this.permissionsServices.uid) {
      return of(null);
    }
    return this.profile$.fetch(
      this._odooService
        .searchRead$<Profile>(
          'res.users',
          [['id', '=', this.permissionsServices.uid]],
          ['id', 'email', 'display_name', 'share', 'groups_id', 'employee_id']
        )
        .pipe(
          filter(isNonNullable),
          map(result => result[0]),
          tap(profile => {
            this.permissionsServices.setRole(profile.share ? 'shared' : 'interne');
          })
        )
    );
  }
}
