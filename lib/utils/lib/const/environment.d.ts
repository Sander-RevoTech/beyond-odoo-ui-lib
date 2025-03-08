import { InjectionToken } from '@angular/core';
export declare const APPLICATION_CONFIG: InjectionToken<IApplicationConfig>;
export interface ILocalConfig {
    isLocal: boolean;
}
export interface IApplicationConfig {
    isCustomerApplication: boolean;
}
