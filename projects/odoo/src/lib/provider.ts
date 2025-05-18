import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Provider } from '@angular/core';

import { IOdooServerConfig, ODOO_SERVER_CONFIG_KEY } from './injectionToken';
import { TargetUrlInterceptor } from './interceptor/targetUrlInterceptor';

export const provideOdoo = (config: IOdooServerConfig): Provider => [
  {
    provide: ODOO_SERVER_CONFIG_KEY,
    useValue: config,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: TargetUrlInterceptor,
    multi: true,
  },
];
