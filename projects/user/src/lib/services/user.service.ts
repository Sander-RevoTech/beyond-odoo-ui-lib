import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { BydBaseOdooService, BydEmployeeService } from '@beyond/odoo';
import { BydPermissionsServices, HandleSimpleRequest } from '@beyond/server';
import { getFirstNumber, isNonNullable } from '@beyond/utils';
import { debounceTime, filter, map, mergeMap, of, switchMap, tap } from 'rxjs';

import { CompanyComponent } from '../components/company/company.component';
import { Profile } from './dto/profile';

@Injectable({
  providedIn: 'root',
})
export class BydUserService extends BydBaseOdooService {
  readonly profile = new HandleSimpleRequest<Profile>();
  readonly warehouse = new HandleSimpleRequest<number[]>();
  readonly company = new HandleSimpleRequest<number[]>();

  readonly permissionsServices = inject(BydPermissionsServices);
  readonly employeesServices = inject(BydEmployeeService);

  public openDialog = inject(MatDialog);

  constructor() {
    super();
    this.permissionsServices.updated$
      .pipe(
        debounceTime(500),
        mergeMap(() => this.fetchProfile$())
      )
      .subscribe();
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
          ['id', 'email', 'display_name', 'share', 'groups_id', 'employee_id', 'company_ids']
        )
        .pipe(
          filter(isNonNullable),
          map(result => result[0]),
          switchMap(profile => {
            this.permissionsServices.setRole(profile.share ? 'shared' : 'interne');
            this.company.data$.next(profile.company_ids);

            if (!profile.share) {
              this.permissionsServices.setEmployee(getFirstNumber(profile.employee_id));
              return of(profile);
            } else {
              return this.employeesServices.getRelatedByUserId$(profile.id).pipe(
                tap(employee => this.permissionsServices.setEmployee(employee.id)),
                map(() => profile)
              );
            }
          }),
          switchMap(profile => {
            if (this.permissionsServices.company) {
              return of(profile);
            }
            return this.openDialog
              .open(CompanyComponent, {
                disableClose: true,
              })
              .afterClosed()
              .pipe(map(() => profile));
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
