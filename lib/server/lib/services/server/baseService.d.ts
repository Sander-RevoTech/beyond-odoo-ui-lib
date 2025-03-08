import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { BydGraphService, GraphEndpoint } from '../graphql/public-api';
import { MappingApiType } from './api/requestMap';
import { BydServerSevice } from './api/server.service';
import * as i0 from "@angular/core";
export declare abstract class BydBaseService implements OnDestroy {
    protected _subscriptionList: Subscription[];
    protected _serverService: BydServerSevice;
    protected _graphService: BydGraphService;
    constructor(apiRoutes?: MappingApiType);
    registerRoutes(routes: {
        apiRoutes?: MappingApiType;
        graphEndpoint?: GraphEndpoint;
    }): void;
    ngOnDestroy(): void;
    protected _registerSubscription(subscription: Subscription): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydBaseService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<BydBaseService>;
}
