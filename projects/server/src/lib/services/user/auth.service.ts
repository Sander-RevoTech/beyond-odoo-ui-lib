import { Injectable } from '@angular/core';

import { MappingApiType } from '../server/api/requestMap';
import { BydStrapiService } from '../strapi/strapi.service';


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
export class BydAuthService extends BydStrapiService {
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
