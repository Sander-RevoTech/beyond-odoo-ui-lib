import { InjectionToken } from '@angular/core';
export declare const ODOO_SERVER_CONFIG_KEY: InjectionToken<IOdooServerConfig>;
export interface IOdooServerConfig {
    proxyUrl: string;
    db: string;
    odooUrl: string;
}
