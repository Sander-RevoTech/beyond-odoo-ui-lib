import { Injectable } from '@angular/core';

import { BehaviorSubject, filter, tap } from 'rxjs';
import { TaBaseService } from '../server/baseService';
import { MappingApiType } from '../server/api/requestMap';
import { Request } from '../server/request';
import { Permissions } from './permissions';
import { TaStrapiService } from '../strapi/strapi.service';


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
export class TaAuthService extends TaStrapiService {
  constructor() {
    super();
    super.registerRoutes({
      apiRoutes
    });
  }

  public login(data: { identifier: string, password: string}) {
    return this.authentification$(data).subscribe()
  }
  public logout() {

  }


}
