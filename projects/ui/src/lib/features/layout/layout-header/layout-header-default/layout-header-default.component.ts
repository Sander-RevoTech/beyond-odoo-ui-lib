import { Component } from '@angular/core';

import { BydBaseComponent } from '@beyond/utils';

import { LogoComponent } from '../../../../components/logo/logo.component';
import { BydTitleComponent } from '../../../../components/title/title.component';

@Component({
  selector: 'byd-layout-header-default',
  templateUrl: './layout-header-default.component.html',
  styleUrls: ['./layout-header-default.component.scss'],
  standalone: true,
  imports: [BydTitleComponent, LogoComponent],
})
export class LayoutHeaderDefaultComponent extends BydBaseComponent {
  public goToHome() {
    this._router.navigateByUrl('/');
  }
}
