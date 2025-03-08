import { Injectable, OnDestroy, inject } from '@angular/core';

import { Subscription } from 'rxjs';

import { TaGraphService, GraphEndpoint } from '../graphql/public-api';
import { MappingApiType } from './api/requestMap';
import { TaServerSevice } from './api/server.service';
import { TaStrapiService } from '../strapi/strapi.service';

@Injectable({
  providedIn: 'root',
})
export abstract class TaBaseService implements OnDestroy {
  protected _subscriptionList: Subscription[] = [];
  protected _serverService = inject(TaServerSevice);
  protected _graphService = inject(TaGraphService);

  constructor(apiRoutes?: MappingApiType) {
    this.registerRoutes({ apiRoutes });
  }

  public registerRoutes(routes: { apiRoutes?: MappingApiType; graphEndpoint?: GraphEndpoint }) {
    if (routes.apiRoutes) this._serverService.registerRoutes(routes.apiRoutes);
    if (routes.graphEndpoint) this._graphService.registerGraphEndpoint(routes.graphEndpoint);
  }

  ngOnDestroy() {
    this._subscriptionList.forEach(subscription => subscription.unsubscribe());
  }

  protected _registerSubscription(subscription: Subscription) {
    this._subscriptionList.push(subscription);
  }
}
