import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { ODOO_SERVER_CONFIG_KEY, provideOdoo } from '@beyond/odoo';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptorsFromDi()), provideRouter(routes), {
      provide: ODOO_SERVER_CONFIG_KEY,
      useValue: {
          proxyUrl: 'http://localhost:3000',
          db: 'testing',
          odooUrl: 'http://localhost:8069',
        }
    }, provideOdoo()]
};
