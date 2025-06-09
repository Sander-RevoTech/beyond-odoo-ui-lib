import { Component, inject } from '@angular/core';

import { TranslatePipe } from '@beyond/translation';
import { BydButtonComponent, BydLinkComponent, BydTitleComponent } from '@beyond/ui';
import { BydBaseComponent } from '@beyond/utils';

import { BydPwaService } from '../../services/pwa.service';

@Component({
  selector: 'app-pwa',
  templateUrl: './pwa.component.html',
  styleUrls: ['./pwa.component.scss'],
  imports: [BydTitleComponent, BydButtonComponent, TranslatePipe, BydLinkComponent],
})
export class PwaComponent extends BydBaseComponent {
  public show = false;

  private _pwa = inject(BydPwaService);

  constructor() {
    super();

    this._registerSubscription(this._pwa.isPWaCapability$.subscribe(is => (this.show = is)));
  }

  install() {
    this._pwa.launchInstall();
  }

  snooze() {
    this.close();
  }

  public close() {
    this.show = false;
  }
}
