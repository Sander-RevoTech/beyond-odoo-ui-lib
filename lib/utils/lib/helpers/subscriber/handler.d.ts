import { Subscription } from 'rxjs';
export declare class SubscriberHandler {
    protected _subscriptionList: Subscription[];
    constructor();
    destroy(): void;
    registerSubscription(subscription: Subscription): void;
}
