import { Provider } from '@angular/core';
import { IGraphConfig } from './services/graphql/models/graphConfig';
import { IServerConfig } from './services/server/api/server.service';
export declare const provideServer: (data: {
    graphQlConfig: IGraphConfig;
    httpConfig: IServerConfig;
}) => Provider;
