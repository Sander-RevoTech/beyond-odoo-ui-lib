import { InjectionToken } from "@angular/core";

export const ODOO_SERVER_CONFIG_KEY = new InjectionToken<IOdooServerConfig>('odoo-server-config');
export interface IOdooServerConfig {
  proxyUrl: string;
  db: string;
  odooUrl: string;
}
