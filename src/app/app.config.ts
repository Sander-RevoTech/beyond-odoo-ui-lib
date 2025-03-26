import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { ODOO_SERVER_CONFIG_KEY } from '@beyond/odoo';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes),
    {
      provide: ODOO_SERVER_CONFIG_KEY,
      useValue: {
        proxyUrl: 'http://localhost:3000',
        db: 'testing',
        odooUrl: 'http://localhost:8069',
      },
    },
  ],
};
