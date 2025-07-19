import { Location } from '@angular/common';
import { OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BreakpointDetection } from '../helpers/breakpoints/detection';
import { RequestState } from '../helpers/request/state';
import { SubscriberHandler } from '../helpers/subscriber/handler';
import * as i0 from "@angular/core";
export declare abstract class BydAbstractComponent implements OnDestroy {
    breakpoints: BreakpointDetection;
    requestState: RequestState;
    get isMobile(): boolean;
    get isDesktop(): boolean;
    get isMobileDevice$(): import("rxjs").BehaviorSubject<boolean>;
    get isDesktopDevice$(): import("rxjs").Observable<boolean>;
    protected _subscriberHandler: SubscriberHandler;
    protected _route: ActivatedRoute;
    protected _router: Router;
    protected _location: Location;
    constructor();
    ngOnDestroy(): void;
    redirectToWithReload(uri: string): void;
    protected _getSnapshotQueryParams(key: string): string | null;
    protected _registerSubscription(subscription: Subscription): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydAbstractComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BydAbstractComponent, "ng-component", never, {}, {}, never, never, true, never>;
}
