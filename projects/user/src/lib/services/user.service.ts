import { Injectable, inject } from '@angular/core';

import { BydBaseOdooService } from '@beyond/odoo';
import { BydPermissionsServices } from '@beyond/server';
import { BehaviorSubject, filter, mergeMap, of, tap } from 'rxjs';

import { Profile } from './dto/profile';

@Injectable({
  providedIn: 'root',
})
export class BydUserService extends BydBaseOdooService {
  readonly profile$ = new BehaviorSubject<Profile | null>(null);
  readonly permissionsServices = inject(BydPermissionsServices);

  constructor() {
    super();
    this.permissionsServices.updated$.pipe(
      mergeMap(() => this.fetchProfile$())
    ).subscribe()
  }

  public fetchProfile$() {
    if (!this.permissionsServices.uid) {
      return of(null);
    }
    return this._odooService
      .searchRead$<Profile>('res.users', [['id', '=', this.permissionsServices.uid]], ['id', 'email', 'display_name'])
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
