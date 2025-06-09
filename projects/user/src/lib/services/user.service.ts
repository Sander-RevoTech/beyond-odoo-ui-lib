import { Injectable, inject } from '@angular/core';

import { BydBaseOdooService, BydEmployeeService } from '@beyond/odoo';
import { BydPermissionsServices, HandleSimpleRequest } from '@beyond/server';
import { getFirstNumber, isNonNullable } from '@beyond/utils';
import { filter, map, mergeMap, of, switchMap, tap } from 'rxjs';

import { Profile } from './dto/profile';

@Injectable({
  providedIn: 'root',
})
export class BydUserService extends BydBaseOdooService {
  readonly profile = new HandleSimpleRequest<Profile>();
  readonly warehouse = new HandleSimpleRequest<number[]>();

  readonly permissionsServices = inject(BydPermissionsServices);
  readonly employeesServices = inject(BydEmployeeService);

  constructor() {
    super();
    this.permissionsServices.updated$.pipe(mergeMap(() => this.fetchProfile$())).subscribe();
  }

  public fetchProfile$() {
    if (!this.permissionsServices.uid) {
      return of(null);
    }

    return this.profile.fetch(
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
          }),
          switchMap((profile: Profile) => {
            return this.warehouse
              .fetch(
                this.employeesServices
                  .getWarehouses$(getFirstNumber(profile.employee_id) ?? 0)
                  .pipe(filter(isNonNullable))
              )
              .pipe(map(() => profile));
          })
        )
    );
  }
}
