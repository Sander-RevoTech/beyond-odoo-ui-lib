import { InjectionToken } from '@angular/core';
import { BydBaseService } from '../server/baseService';
import { GraphMutationPayload, GraphQueryPayload } from '../graphql/models/graphPayload';
import * as i0 from "@angular/core";
export declare const STRAPI_SERVER_CONFIG: InjectionToken<IStrapiConfig>;
export interface IStrapiConfig {
    url: string;
    token: string;
}
export type GraphStrapiResponse<T> = T;
export type GraphStrapiListResponse<T> = T[];
export type GraphStrapiMutateResponse<T> = T;
export declare class BydStrapiService extends BydBaseService {
    private readonly _permissionsServices;
    private readonly _config;
    constructor();
    authentification$(data: {
        identifier: string;
        password: string;
    }): import("rxjs").Observable<{
        jwt: string;
    }>;
    fetchQuery$<T>(payload: GraphQueryPayload, node: string): import("rxjs").Observable<NonNullable<T>>;
    fetchQueryList$<T>(payload: GraphQueryPayload, node: string): import("rxjs").Observable<GraphStrapiListResponse<T>>;
    mutate$<T>(payload: GraphMutationPayload, node: string): import("rxjs").Observable<NonNullable<T>>;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydStrapiService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<BydStrapiService>;
}
