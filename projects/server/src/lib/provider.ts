import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Provider, importProvidersFrom } from '@angular/core';

import { ApolloModule } from 'apollo-angular';

import { BearerInterceptor } from './interceptor/bearerInterceptor';
import { GRAPHQL_SERVER_CONFIG, IGraphConfig } from './services/graphql/models/graphConfig';
import { IServerConfig, SERVER_CONFIG_KEY } from './services/server/api/server.service';

export const provideServer = (data: {
  graphQlConfig: IGraphConfig;
  httpConfig: IServerConfig;
}): Provider => [
  importProvidersFrom(ApolloModule),
  {
    provide: HTTP_INTERCEPTORS,
    useClass: BearerInterceptor,
    multi: true,
  },
  {
    provide: GRAPHQL_SERVER_CONFIG,
    useValue: data.graphQlConfig,
  },
  {
    provide: SERVER_CONFIG_KEY,
    useValue: data.httpConfig,
  },
];
