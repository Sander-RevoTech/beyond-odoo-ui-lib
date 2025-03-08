import { InjectionToken } from '@angular/core';

export const APPLICATION_CONFIG = new InjectionToken<IApplicationConfig>('config_application');

export interface ILocalConfig {
  isLocal: boolean;
}

export interface IApplicationConfig {
  isCustomerApplication: boolean;
}
