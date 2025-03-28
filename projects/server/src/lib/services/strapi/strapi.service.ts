import { HttpHeaders } from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';

import { isNonNullable } from '@beyond/utils';
import { filter, tap } from 'rxjs';

import { GraphMutationPayload, GraphQueryPayload } from '../graphql/models/graphPayload';
import { BydBaseService } from '../server/baseService';
import { Request } from '../server/request';
import { BydPermissionsServices } from '../user/permissions.services.';

export const STRAPI_SERVER_CONFIG = new InjectionToken<IStrapiConfig>('config_strapi_server');
export interface IStrapiConfig {
  url: string;
  token: string;
}

export type GraphStrapiResponse<T> = T;

export type GraphStrapiListResponse<T> = T[];

export type GraphStrapiMutateResponse<T> = T;

@Injectable({
  providedIn: 'root',
})
export class BydStrapiService extends BydBaseService {
  private readonly _permissionsServices = inject(BydPermissionsServices);
  private readonly _config = inject(STRAPI_SERVER_CONFIG);

  constructor() {
    super();

    const headers = new HttpHeaders({
      authorization: `Bearer ${this._config.token}`,
    });
    super.registerRoutes({
      graphEndpoint: {
        clientName: 'strapi',
        endpoint: this._config.url,
        headers: headers,
      },
    });
  }

  public authentification$(data: { identifier: string; password: string }) {
    return this._serverService
      .request<{ jwt: string }>(new Request({ type: 'Login', cacheTime: -1, content: data, loginRequired: false }))
      .pipe(
        tap(data => {
          this._permissionsServices.token = data.jwt;
          this._permissionsServices.setAuthenticated(true);
        })
      );
  }

  public fetchQuery$<T>(payload: GraphQueryPayload, node: string) {
    return this._graphService.fetchQuery<GraphStrapiResponse<T>>(payload, node, 'strapi').pipe(filter(isNonNullable));
  }

  public fetchQueryList$<T>(payload: GraphQueryPayload, node: string) {
    return this._graphService
      .fetchQuery<GraphStrapiListResponse<T>>(payload, node, 'strapi')
      .pipe(filter(isNonNullable));
  }

  public mutate$<T>(payload: GraphMutationPayload, node: string) {
    return this._graphService.mutate<GraphStrapiResponse<T>>(payload, node, 'strapi').pipe(filter(isNonNullable));
  }
}
