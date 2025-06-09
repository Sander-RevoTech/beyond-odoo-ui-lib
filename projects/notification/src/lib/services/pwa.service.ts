import { Inject, Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

export interface IPwaConfig {
  active: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class BydPwaService {
  public isPWaCapability$ = new BehaviorSubject<boolean>(false);

  private _promptEvent!: any;

  constructor() {
    window.addEventListener('beforeinstallprompt', event => {
      this._promptEvent = event;
      this.isPWaCapability$.next(true);
    });
  }

  public isPWaCapability() {
    return !!this._promptEvent;
  }
  public launchInstall(): void {
    if (this._promptEvent) {
      this._promptEvent.prompt();
    }
  }
}
