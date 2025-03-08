import { InjectionToken } from "@angular/core";

export const GRAPHQL_SERVER_CONFIG = new InjectionToken<IGraphConfig>('config_graphQl_server');

export interface IGraphConfig {
    url: string;
}
