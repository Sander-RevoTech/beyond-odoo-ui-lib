import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TaGraphService, GraphEndpoint } from '../graphql/public-api';
import { MappingApiType } from './api/requestMap';
import { TaServerSevice } from './api/server.service';
import * as i0 from "@angular/core";
export declare abstract class TaBaseService implements OnDestroy {
    protected _subscriptionList: Subscription[];
    protected _serverService: TaServerSevice;
    protected _graphService: TaGraphService;
    constructor(apiRoutes?: MappingApiType);
    registerRoutes(routes: {
        apiRoutes?: MappingApiType;
        graphEndpoint?: GraphEndpoint;
    }): void;
    ngOnDestroy(): void;
    protected _registerSubscription(subscription: Subscription): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TaBaseService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TaBaseService>;
}
