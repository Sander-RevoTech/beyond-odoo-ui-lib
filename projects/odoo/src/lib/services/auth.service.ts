import { inject, Injectable } from '@angular/core';

import { MappingApiType, BydPermissionsServices } from '@beyond/server';
import { BydBaseOdooService } from './baseService';


interface UserProfile {

}
const apiRoutes: MappingApiType = {
  Login: {
    type: 'POST',
    url: '{ApiUrl}/api/auth/local',
  },
};

@Injectable({
  providedIn: 'root',
})
export class BydAuthOdooService extends BydBaseOdooService {
  readonly permissionsServices = inject(BydPermissionsServices);
  constructor() {
    super();
    super.registerRoutes({
      apiRoutes
    });
  }

  public login(data: { identifier: string, password: string}) {
    return this._odooService.login$(data.identifier, data.password);
  }

  public logout() {
    this.permissionsServices.reset();
    location.reload();
  }


}
