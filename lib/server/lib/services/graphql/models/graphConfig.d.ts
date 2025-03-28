import { InjectionToken } from '@angular/core';
export declare const GRAPHQL_SERVER_CONFIG: InjectionToken<IGraphConfig>;
export interface IGraphConfig {
    url: string;
}
