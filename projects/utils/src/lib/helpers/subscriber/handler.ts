import { Subscription } from 'rxjs';

export class SubscriberHandler {
  protected _subscriptionList: Subscription[] = [];

  constructor() {}

  public destroy() {
    this._subscriptionList.forEach(subscription => subscription.unsubscribe());
  }

  public registerSubscription(subscription: Subscription) {
    this._subscriptionList.push(subscription);
  }
}
