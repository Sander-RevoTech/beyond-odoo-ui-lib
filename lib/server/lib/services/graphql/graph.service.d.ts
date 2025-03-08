import { Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { BehaviorSubject } from 'rxjs';
import { GraphMutationPayload, GraphQueryPayload } from './models/graphPayload';
import { GraphEndpoint } from './public-api';
import * as i0 from "@angular/core";
export declare class BydGraphService {
    private httpLink;
    private apollo;
    private readonly _graphConfig;
    contactsLoaded$: BehaviorSubject<boolean>;
    isReady$: BehaviorSubject<boolean>;
    private _defaultEndpoint;
    private _cache;
    constructor(httpLink: HttpLink, apollo: Apollo);
    clearCache(key: string): void;
    fetchQueryList<T>(payload: GraphQueryPayload, node: string, context: string): import("rxjs").Observable<T[]>;
    fetchPagedQueryList<T>(payload: GraphQueryPayload, node: string, context: string): import("rxjs").Observable<{
        pageInfo?: import("./models/pageInfo").PageInfo;
        totalCount: number;
        items?: T[] | undefined;
    }>;
    fetchQuery<T>(payload: GraphQueryPayload, node: string, context: string): import("rxjs").Observable<T>;
    mutate<T>(payload: GraphMutationPayload, mutationName: string, context: string, clearCache?: string[]): import("rxjs").Observable<T>;
    registerGraphEndpoint(graphEndpoint: GraphEndpoint): void;
    private _setupData;
    private _getWrapper;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydGraphService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<BydGraphService>;
}
