import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { ODOO_SERVER_CONFIG_KEY } from '@beyond/odoo';
import { provideTranslation } from '@beyond/translation';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes),
    provideTranslation({
      default: 'en',
      supportedLanguages: ['en'],
    }),
    {
      provide: ODOO_SERVER_CONFIG_KEY,
      useValue: {
        proxyUrl: 'http://192.168.1.47:3000',
        db: 're-uz-test',
        odooUrl: 'http://localhost:8069',
      },
    },
  ],
};
