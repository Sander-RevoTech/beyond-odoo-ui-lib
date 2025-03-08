import { Provider } from "@angular/core";
import { IGraphConfig } from "./services/graphql/models/graphConfig";
import { IServerConfig } from "./services/server/api/server.service";
import { IStrapiConfig } from "./services/strapi/strapi.service";
export declare const provideServer: (data: {
    graphQlConfig: IGraphConfig;
    httpConfig: IServerConfig;
    strapiConfig: IStrapiConfig;
}) => Provider;
