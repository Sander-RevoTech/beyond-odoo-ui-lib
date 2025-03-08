
import { importProvidersFrom, Provider } from "@angular/core";
import { GRAPHQL_SERVER_CONFIG, IGraphConfig } from "./services/graphql/models/graphConfig";
import { ApolloModule } from "apollo-angular";
import { IServerConfig, SERVER_CONFIG_KEY } from "./services/server/api/server.service";
import { IStrapiConfig, STRAPI_SERVER_CONFIG } from "./services/strapi/strapi.service";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { BearerInterceptor } from "./interceptor/bearerInterceptor";

export const provideServer = (data: {graphQlConfig: IGraphConfig, httpConfig: IServerConfig, strapiConfig: IStrapiConfig}): Provider => [
    importProvidersFrom(ApolloModule),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BearerInterceptor,
      multi: true
    },
    {
      provide: GRAPHQL_SERVER_CONFIG,
      useValue: data.graphQlConfig,
    },
    {
      provide: SERVER_CONFIG_KEY,
      useValue: data.httpConfig,
    },
    {
      provide: STRAPI_SERVER_CONFIG,
      useValue: data.strapiConfig,
    },
  ]
