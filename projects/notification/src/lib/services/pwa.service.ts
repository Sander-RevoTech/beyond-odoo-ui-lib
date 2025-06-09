import { Inject, Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

export const PWA_CONFIG_KEY = 'config_pwa';

export interface IPwaConfig {
  active: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class BydPwaService {
  public isPWaCapability$ = new BehaviorSubject<boolean>(false);

  private _promptEvent!: any;

  constructor(
    @Inject(PWA_CONFIG_KEY)
    private _config: IPwaConfig
  ) {
    //  if (this._config.active) {
    window.addEventListener('beforeinstallprompt', event => {
      this._promptEvent = event;
      this.isPWaCapability$.next(true);
    });
    // }
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
