import { InjectionToken } from '@angular/core';

import { IGraphConfig } from '../graphql/models/graphConfig';

export const GRAPHQL_CONFIG_TOKEN = new InjectionToken<IGraphConfig>('IGraphConfig');
