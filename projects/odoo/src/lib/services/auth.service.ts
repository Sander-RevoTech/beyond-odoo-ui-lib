import { Injectable, inject } from '@angular/core';

import { BydPermissionsServices } from '@beyond/server';

import { BydBaseOdooService } from './baseService';

@Injectable({
  providedIn: 'root',
})
export class BydAuthOdooService extends BydBaseOdooService {
  readonly permissionsServices = inject(BydPermissionsServices);
  constructor() {
    super();
  }

  public login$(data: { identifier: string | null; password: string }) {
    return this._odooService.login$(data.identifier, data.password);
  }

  public logout() {
    this.permissionsServices.reset();
    location.reload();
  }
}
